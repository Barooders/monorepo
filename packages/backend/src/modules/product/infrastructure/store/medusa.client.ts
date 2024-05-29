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
import { medusaClient } from '@libs/infrastructure/medusa/client';
import {
  AdminPostProductsReq,
  ProductStatus as MedusaProductStatus,
} from '@medusajs/medusa';
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

    const { product } = await medusaClient.admin.products.retrieve(medusaId);

    return {
      body_html: product.description ?? '',
      images: product.images.map((image) => ({
        src: image.url,
        storeId: new ImageStoreId({ medusaId: image.id }),
      })),
      tags: product.tags.map((tag) => tag.value),
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

  // TODO: add vendor link
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

    const tags = getValidTags(product.tags);

    const {
      attributes: { weight },
    } = await this.pimClient.getPimProductType(product.product_type);
    const productTypeId = await this.getOrCreateCategory(product.product_type);

    const options = uniq(
      product.variants.flatMap((variant) =>
        variant.optionProperties.map((option) => option.key),
      ),
    );

    const metadata: Record<string, unknown> = {
      owner: isPro ? 'pro' : 'c2c',
      source: product.source,
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
      tags: tags.map((tag) => ({ value: tag })),
      weight,
      categories: [{ id: productTypeId }],
      options: options.map((name) => ({ title: name })),
      variants: compact(
        product.variants.map(
          (variant): MedusaVariantRequest => ({
            title: variant.title ?? 'Default',
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

    const { product: createdProduct } =
      await medusaClient.admin.products.create(requestBody);

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

  updateProduct(
    productId: UUID,
    data: Partial<Omit<Product, 'variants'> & { vendorId: string }>,
  ): Promise<void> {
    this.logger.log(`Updating product ${productId}`, data);

    throw new Error('Method not implemented.');
  }

  createProductVariant(
    productInternalId: UUID,
    data: Variant,
  ): Promise<VariantCreatedInStore> {
    this.logger.log(`Creating variant for product ${productInternalId}`, data);

    throw new Error('Method not implemented.');
  }

  updateProductVariant(variantId: UUID, data: Partial<Variant>): Promise<void> {
    this.logger.log(`Updating variant ${variantId}`, data);

    throw new Error('Method not implemented.');
  }

  deleteProductVariant(variantId: UUID): Promise<void> {
    this.logger.log(`Deleting variant ${variantId}`);

    throw new Error('Method not implemented.');
  }

  approveProduct(productId: UUID): Promise<void> {
    this.logger.log(`Approving product ${productId}`);

    throw new Error('Method not implemented.');
  }

  rejectProduct(productId: UUID): Promise<void> {
    this.logger.log(`Rejecting product ${productId}`);

    throw new Error('Method not implemented.');
  }

  addProductImage(
    productId: UUID,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    this.logger.log(`Adding image to product ${productId}`, image);

    throw new Error('Method not implemented.');
  }

  deleteProductImage(productId: UUID, imageId: string): Promise<void> {
    this.logger.log(`Deleting image ${imageId} from product ${productId}`);

    throw new Error('Method not implemented.');
  }

  createCommissionProduct(
    product: ProductCreationInput,
  ): Promise<{ id: string; variants: { id: string }[] }> {
    this.logger.log(`Creating commission product ${product.title}`);

    throw new Error('Method not implemented.');
  }

  cleanOldCommissions(): Promise<void> {
    throw new Error('Method not implemented.');
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
      const response = await medusaClient.admin.productCategories.list({
        q: categoryName,
      });
      const existingCategory = first(response.product_categories);
      if (existingCategory) return existingCategory.id;

      return await this.createCategory(categoryName);
    } catch (e) {
      return await this.createCategory(categoryName);
    }
  }

  private async createCategory(categoryName: string) {
    this.logger.log(`Creating category ${categoryName}`);
    const createResponse = await medusaClient.admin.productCategories.create({
      name: categoryName,
      is_active: true,
    });

    return createResponse.product_category.id;
  }
}
