import { COMMISSION_TYPE } from '@libs/domain/constants/commission-product.constants';
import { CustomerRepository } from '@libs/domain/customer.repository';
import {
  Condition,
  PrismaMainClient,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import {
  Product,
  ProductToStore,
  Variant,
} from '@libs/domain/product.interface';
import { getValidTags } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { fromCents, toCents } from '@libs/helpers/currency';
import { jsonStringify } from '@libs/helpers/json';
import {
  handleMedusaResponse,
  medusaClient,
} from '@libs/infrastructure/medusa/client';
import {
  AdminPostProductsProductReq,
  AdminPostProductsProductVariantsReq,
  AdminPostProductsReq,
  ProductStatus as MedusaProductStatus,
} from '@medusajs/medusa';
import { ResponsePromise } from '@medusajs/medusa-js';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import {
  IStoreClient,
  ProductCreatedInStore,
  ProductCreationInput,
  ProductDetails,
  VariantCreatedInStore,
} from '@modules/product/domain/ports/store.client';
import { ImageToUpload, ProductImage } from '@modules/product/domain/types';
import { ImageStoreId } from '@modules/product/domain/value-objects/image-store-id.value-object';
import { ProductStoreId } from '@modules/product/domain/value-objects/product-store-id.value-object';
import { VariantStoreId } from '@modules/product/domain/value-objects/variant-store-id.value-object';
import { Injectable, Logger } from '@nestjs/common';
import { head } from 'lodash';
import compact from 'lodash/compact';
import first from 'lodash/first';
import uniq from 'lodash/uniq';
import { ImageUploadsClient } from './image-uploads-client';

const handle = (title: string): string => {
  const slugified = title
    .toLowerCase()
    .replace(/ /g, '-')
    .replace(/[^a-z0-9-]/g, '');

  return `${slugified}-${Date.now()}`;
};

type ArrayElement<ArrayType extends unknown[] | undefined> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;
type MedusaVariantRequest = ArrayElement<AdminPostProductsReq['variants']>;

@Injectable()
export class MedusaClient implements IStoreClient {
  private readonly logger = new Logger(MedusaClient.name);

  constructor(
    private customerRepository: CustomerRepository,
    private prisma: PrismaMainClient,
    private readonly imageUploadsClient: ImageUploadsClient,
    private pimClient: IPIMClient,
  ) {}

  private handleMedusaResponse = async <T>(
    call: ResponsePromise<T>,
  ): Promise<T> => await handleMedusaResponse(call, this.logger);

  async getProductDetails({ uuid: productId }: UUID): Promise<ProductDetails> {
    this.logger.log(`Getting product details for ${productId}`);

    const { medusaId, vendor, status, variants } =
      await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
        select: {
          medusaId: true,
          variants: true,
          status: true,
          vendor: { select: { sellerName: true } },
        },
      });

    if (medusaId == null) {
      throw new Error(`Product ${productId} not found in Medusa`);
    }

    const { product } = await this.handleMedusaResponse(
      medusaClient.admin.products.retrieve(medusaId),
    );

    return {
      body_html: product.description ?? '',
      images: product.images.map((image) => ({
        src: image.url,
        storeId: new ImageStoreId({ medusaId: image.id }),
      })),
      tags: (product.metadata?.tags as string[]) ?? [],
      product_type: product.categories[0].name,
      status,
      vendor: vendor.sellerName ?? '',
      variants: variants.map((variant) => ({
        internalId: variant.id,
        condition: variant.condition ?? Condition.GOOD,
        price: fromCents(Number(variant.priceInCents)).toString(),
        compare_at_price:
          variant.compareAtPriceInCents !== null
            ? fromCents(Number(variant.compareAtPriceInCents)).toString()
            : undefined,
      })),
    };
  }

  async createProduct(product: ProductToStore): Promise<ProductCreatedInStore> {
    this.logger.log(`Creating product ${product.title}`);

    const customer = await this.customerRepository.getCustomerFromVendorId(
      product.vendorId,
    );

    if (!customer)
      throw new Error(`Cannot find vendor with id: ${product.vendorId}`);

    const { isPro } = customer;

    const imagesUrl = product.images
      ?.filter((image) => image.src !== undefined)
      .map((image) => image.src as string);

    const uploadedImages =
      await this.imageUploadsClient.uploadImages(imagesUrl);

    this.logger.debug('Images uploaded');

    const {
      attributes: { weight },
    } = await this.pimClient.getPimProductType(product.product_type);
    const productTypeId = await this.getOrCreateCategory(product.product_type);

    this.logger.debug('Category retrieved');

    const options = uniq(
      product.variants.flatMap((variant) =>
        variant.optionProperties.map((option) => option.key),
      ),
    );

    const metadata: Record<string, unknown> = {
      owner: isPro ? 'pro' : 'c2c',
      source: product.source,
      tags: getValidTags(product.tags),
    };
    product.metafields.forEach(({ key, value }) => {
      metadata[key] = value;
    });

    const productHandle = handle(product.title);
    const requestBody: AdminPostProductsReq = {
      title: product.title,
      is_giftcard: false,
      discountable: true,
      description: product.body_html,
      status: this.mapStatus(product.status),
      images: uploadedImages,
      handle: productHandle,
      weight,
      vendor_id: product.vendorId,
      categories: [{ id: productTypeId }],
      options: options.map((name) => ({ title: name })),
      variants: compact(
        product.variants.map(
          (variant): MedusaVariantRequest => ({
            title: variant.title ?? 'Default',
            weight,
            inventory_quantity: variant.inventory_quantity,
            prices: [
              ...(variant.price !== undefined
                ? [
                    {
                      amount: toCents(variant.price),
                      currency_code: 'EUR',
                    },
                  ]
                : []),
            ],
            options: variant.optionProperties.map((option) => ({
              value: option.value,
            })),
          }),
        ),
      ),
      metadata,
    };

    this.logger.debug('Start creating product');

    const { product: createdProduct } = await this.handleMedusaResponse(
      medusaClient.admin.products.create(requestBody),
    );

    return {
      storeId: new ProductStoreId({ medusaId: createdProduct.id }),
      title: createdProduct.title,
      handle: productHandle,
      images: createdProduct.images.map((image) => ({
        src: image.url,
      })),
      variants: createdProduct.variants.map((variant) => ({
        storeId: new VariantStoreId({ medusaId: variant.id }),
      })),
    };
  }

  async updateProduct(
    { uuid: productId }: UUID,
    {
      metafields,
      tags,
      status,
      vendorId,
      images,
      ...data
    }: Partial<Omit<Product, 'variants'> & { vendorId: string }>,
  ): Promise<void> {
    this.logger.log(`Updating product ${productId}`);

    const { medusaId } = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { medusaId: true },
    });

    if (medusaId == null) {
      throw new Error(`Product ${productId} not created in Medusa`);
    }

    let weight: number | undefined;
    if (data.product_type !== undefined) {
      const {
        attributes: { weight: newWeight },
      } = await this.pimClient.getPimProductType(data.product_type);
      weight = newWeight;
    }
    const productTypeId =
      data.product_type !== undefined
        ? await this.getOrCreateCategory(data.product_type)
        : undefined;

    const updatedImages =
      images === undefined
        ? undefined
        : await this.imageUploadsClient.uploadImages(
            compact(images.map((image) => image.src)),
          );

    const metadata: Record<string, unknown> = {
      tags: tags !== undefined ? getValidTags(tags) : undefined,
    };
    if (metafields !== undefined) {
      for (const { key, value } of metafields) {
        metadata[key] = value;
      }
    }
    const dataToUpdate: AdminPostProductsProductReq = {
      title: data.title,
      description: data.body_html,
      handle: data.title !== undefined ? handle(data.title) : undefined,
      weight,
      vendor_id: vendorId,
      categories:
        productTypeId !== undefined ? [{ id: productTypeId }] : undefined,
      ...(status !== undefined ? { status: this.mapStatus(status) } : {}),
      ...(metafields !== undefined || tags !== undefined
        ? {
            metadata,
          }
        : {}),
      ...(updatedImages !== undefined ? { images: updatedImages } : {}),
    };

    await this.handleMedusaResponse(
      medusaClient.admin.products.update(medusaId, dataToUpdate),
    );
  }

  async createProductVariant(
    { uuid: productInternalId }: UUID,
    data: Variant,
  ): Promise<VariantCreatedInStore> {
    this.logger.log(`Creating variant for product ${productInternalId}`);

    const { medusaId, variants } = await this.prisma.product.findUniqueOrThrow({
      where: { id: productInternalId },
      select: {
        medusaId: true,
        variants: {
          select: {
            medusaId: true,
          },
        },
      },
    });

    if (medusaId == null) {
      throw new Error(`Product ${productInternalId} not found in Medusa`);
    }

    const request: AdminPostProductsProductVariantsReq = {
      title: data.title ?? 'Default',
      prices: [
        ...(data.price !== undefined
          ? [
              {
                amount: toCents(data.price),
                currency_code: 'EUR',
              },
            ]
          : []),
      ],
      options: data.optionProperties.map((option) => ({
        option_id: option.key,
        value: option.value,
      })),
    };
    const { product } = await this.handleMedusaResponse(
      medusaClient.admin.products.createVariant(medusaId, request),
    );

    const previousVariantIds = variants.map((variant) => variant.medusaId);
    const newVariant = product.variants.find(
      (variant) => !previousVariantIds.includes(variant.id),
    );

    if (newVariant === undefined) {
      throw new Error('Failed to find new variant');
    }

    return {
      storeId: new VariantStoreId({ medusaId: newVariant.id }),
    };
  }

  async updateProductVariant(
    { uuid: variantId }: UUID,
    { price, compare_at_price, condition, ...data }: Partial<Variant>,
  ): Promise<void> {
    this.logger.log(`Updating variant ${variantId}`);

    const {
      medusaId: variantStoreId,
      product: { medusaId: productStoreId },
    } = await this.prisma.productVariant.findUniqueOrThrow({
      where: { id: variantId },
      select: { medusaId: true, product: { select: { medusaId: true } } },
    });

    if (variantStoreId == null || productStoreId == null) {
      throw new Error(`Variant ${variantId} not found in Medusa`);
    }

    if (compare_at_price !== undefined || condition !== undefined) {
      this.logger.warn(
        `Compare at price and condition are not supported: ${jsonStringify({ compare_at_price, condition })}`,
      );
    }

    await this.handleMedusaResponse(
      medusaClient.admin.products.updateVariant(
        productStoreId,
        variantStoreId,
        {
          prices: [
            ...(price !== undefined
              ? [
                  {
                    amount: toCents(price),
                    currency_code: 'EUR',
                  },
                ]
              : []),
          ],
          ...data,
        },
      ),
    );
  }

  async deleteProductVariant({ uuid: variantId }: UUID): Promise<void> {
    this.logger.log(`Deleting variant ${variantId}`);

    const {
      medusaId: variantMedusaId,
      product: { medusaId: productMedusaId },
    } = await this.prisma.productVariant.findUniqueOrThrow({
      where: { id: variantId },
      select: { medusaId: true, product: { select: { medusaId: true } } },
    });

    if (variantMedusaId == null || productMedusaId == null) {
      throw new Error(`Variant ${variantId} is not present in Medusa`);
    }

    await this.handleMedusaResponse(
      medusaClient.admin.products.deleteVariant(
        productMedusaId,
        variantMedusaId,
      ),
    );
  }

  async addProductImage(
    { uuid: productId }: UUID,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    const { medusaId } = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { medusaId: true },
    });

    if (medusaId == null) {
      throw new Error(`Product ${productId} not found in Medusa`);
    }

    const { product } = await this.handleMedusaResponse(
      medusaClient.admin.products.retrieve(medusaId),
    );

    let uploadedImage: string[] = [];
    if (image.attachment !== undefined) {
      const base64Content = image.attachment.split(';base64,').pop();
      if (base64Content === undefined) {
        throw new Error('Failed to extract base64 content');
      }
      uploadedImage = [
        await this.imageUploadsClient.uploadBase64Image(base64Content),
      ];
    } else if (image.src !== undefined) {
      uploadedImage = await this.imageUploadsClient.uploadImages([image.src]);
    } else {
      throw new Error('Image attachment or src is required');
    }

    const images = [
      ...product.images.map((image) => image.url),
      ...uploadedImage,
    ];

    const { product: updatedProduct } = await this.handleMedusaResponse(
      medusaClient.admin.products.update(medusaId, {
        images,
      }),
    );

    const previousImages = product.images.map((image) => image.id);
    const newImage = updatedProduct.images.find(
      (img) => !previousImages.includes(img.id),
    );

    if (newImage === undefined) {
      throw new Error('Failed to find new image');
    }

    return {
      src: newImage.url,
      storeId: new ImageStoreId({ medusaId: newImage.id }),
    };
  }

  async deleteProductImage(
    { uuid: productId }: UUID,
    imageId: ImageStoreId,
  ): Promise<void> {
    this.logger.log(
      `Deleting image ${imageId.value} from product ${productId}`,
    );

    if (imageId.medusaIdIfExists === undefined) {
      throw new Error('Image id is required');
    }

    const { medusaId: productMedusaId } =
      await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
        select: { medusaId: true },
      });

    if (productMedusaId == null) {
      throw new Error(`Product ${productId} not found in Medusa`);
    }

    const { product } = await this.handleMedusaResponse(
      medusaClient.admin.products.retrieve(productMedusaId),
    );

    const images = product.images
      .filter((img) => img.id !== imageId.medusaIdIfExists)
      .map((img) => img.url);

    await this.handleMedusaResponse(
      medusaClient.admin.products.update(productMedusaId, {
        images,
      }),
    );
  }

  approveProduct({ uuid: productId }: UUID): Promise<void> {
    this.logger.log(`Approving product ${productId}`);

    throw new Error('Method not implemented.');
  }

  rejectProduct({ uuid: productId }: UUID): Promise<void> {
    this.logger.log(`Rejecting product ${productId}`);

    throw new Error('Method not implemented.');
  }

  async createCommissionProduct(
    product: ProductCreationInput,
  ): Promise<VariantStoreId> {
    const productHandle = handle(product.title);
    const productTypeId = await this.getOrCreateCategory(product.productType);

    const requestBody: AdminPostProductsReq = {
      title: product.title,
      is_giftcard: false,
      discountable: false,
      description: product.description,
      status: MedusaProductStatus.PUBLISHED,
      images: [product.featuredImgSrc.url],
      handle: productHandle,
      categories: [{ id: productTypeId }],
      variants: compact(
        product.variants.map(
          (variant): MedusaVariantRequest => ({
            title: 'Unique',
            inventory_quantity: 1,
            prices: [
              {
                amount: variant.price.amountInCents,
                currency_code: 'EUR',
              },
            ],
          }),
        ),
      ),
    };

    const { product: createdProduct } = await this.handleMedusaResponse(
      medusaClient.admin.products.create(requestBody),
    );

    const variant = first(createdProduct.variants);

    if (variant === undefined) {
      throw new Error('Failed to create commission variant');
    }

    return new VariantStoreId({ medusaId: variant.id });
  }

  async cleanOldCommissions(beforeDate: Date): Promise<void> {
    const commissionCategory = await medusaClient.admin.productCategories.list({
      q: COMMISSION_TYPE,
    });
    const commissionCategoryId = head(
      commissionCategory.product_categories,
    )?.id;

    if (commissionCategoryId === undefined) {
      throw new Error('Commission category not found in Medusa');
    }

    const commissionProductsToDelete = await medusaClient.admin.products.list({
      category_id: [commissionCategoryId],
      created_at: {
        lt: beforeDate,
      },
    });

    this.logger.log(
      `Deleting ${commissionProductsToDelete.products.length} commissions`,
    );

    for (const product of commissionProductsToDelete.products) {
      if (product.id === undefined) {
        throw new Error(
          `Cannot delete product without id: ${jsonStringify(product)}`,
        );
      }

      await medusaClient.admin.products.delete(product.id);
      this.logger.log(`Deleted commission ${product.id}`);
    }
  }

  private mapStatus(status: ProductStatus): MedusaProductStatus {
    return status === 'ACTIVE'
      ? MedusaProductStatus.PUBLISHED
      : status === 'ARCHIVED'
        ? MedusaProductStatus.REJECTED
        : MedusaProductStatus.DRAFT;
  }

  private async getOrCreateCategory(categoryName: string) {
    try {
      const response = await this.handleMedusaResponse(
        medusaClient.admin.productCategories.list({
          q: categoryName,
        }),
      );
      const existingCategory = first(response.product_categories);
      if (existingCategory !== undefined) return existingCategory.id;

      return await this.createCategory(categoryName);
    } catch (e) {
      return await this.createCategory(categoryName);
    }
  }

  private async createCategory(categoryName: string) {
    this.logger.log(`Creating category ${categoryName}`);
    const createResponse = await this.handleMedusaResponse(
      medusaClient.admin.productCategories.create({
        name: categoryName,
        is_active: true,
      }),
    );

    return createResponse.product_category.id;
  }
}
