import { shopifyConfig } from '@config/shopify.config';
import {
  BackOffPolicy,
  Retryable,
} from '@libs/application/decorators/retryable.decorator';
import { COMMISSION_TYPE } from '@libs/domain/constants/commission-product.constants';
import { CustomerRepository } from '@libs/domain/customer.repository';
import {
  Condition,
  PrismaMainClient,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import {
  Metafield,
  ProductToStore,
  ProductToUpdate,
  ShopifyProductStatus,
  StoredMetafield,
  Variant,
  getVariantsOptions,
} from '@libs/domain/product.interface';
import {
  BAROODERS_NAMESPACE,
  MetafieldType,
  getValidTags,
} from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { fromCents } from '@libs/helpers/currency';
import { jsonStringify } from '@libs/helpers/json';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import {
  findMetafield,
  parseShopifyError,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import {
  fromStorefrontId,
  toStorefrontId,
} from '@libs/infrastructure/shopify/shopify-id';
import { getValidShopifyId } from '@libs/infrastructure/shopify/validators';
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
import { MutationProductCreateArgs } from '@quasarwork/shopify-api-types/api/admin/2023-01';
import {
  ProductStatus as AdminAPIProductStatus,
  MediaContentType,
  Mutation,
  MutationPublishablePublishArgs,
  ProductVariantInventoryPolicy,
} from '@quasarwork/shopify-api-types/api/admin/2023-04';
import { RequestReturn } from '@quasarwork/shopify-api-types/utils/shopify-api';
import { first } from 'lodash';
import { IProductVariant } from 'shopify-api-node';

const mapShopifyStatus = (status: ProductStatus): ShopifyProductStatus => {
  switch (status) {
    case ProductStatus.ACTIVE:
      return ShopifyProductStatus.ACTIVE;
    case ProductStatus.ARCHIVED:
      return ShopifyProductStatus.ARCHIVED;
    case ProductStatus.DRAFT:
      return ShopifyProductStatus.DRAFT;
    default:
      throw new Error(`Unknown product status: ${status}`);
  }
};

const getOwnerMetafield = (isPro: boolean) => ({
  key: 'owner',
  value: isPro ? 'b2c' : 'c2c',
  type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
  namespace: BAROODERS_NAMESPACE,
});

@Injectable()
export class ShopifyClient implements IStoreClient {
  private readonly logger = new Logger(ShopifyClient.name);
  constructor(
    private customerRepository: CustomerRepository,
    private shopifyApiBySession: ShopifyApiBySession,
    private prisma: PrismaMainClient,
    private pimClient: IPIMClient,
  ) {}

  async getProductDetails({ uuid: productId }: UUID): Promise<ProductDetails> {
    const { shopifyId, variants, vendor, status } =
      await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
        select: {
          shopifyId: true,
          variants: true,
          status: true,
          vendor: { select: { sellerName: true } },
        },
      });
    const product = await shopifyApiByToken.product.get(Number(shopifyId));

    return {
      images: product.images.map((image) => ({
        src: image.src,
        storeId: new ImageStoreId({ shopifyId: image.id }),
      })),
      tags: product.tags.split(', '),
      product_type: product.product_type,
      body_html: product.body_html,
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
    const customer = await this.customerRepository.getCustomerFromVendorId(
      product.vendorId,
    );
    const {
      attributes: { weight },
    } = await this.pimClient.getPimProductType(product.product_type);

    if (!customer)
      throw new Error(`Cannot find vendor with id: ${product.vendorId}`);

    const { sellerName, isPro } = customer;

    const options = getVariantsOptions(product.variants);
    const productTitleEndsWithNumber = !!product.title.match(/\d+$/);

    const shopifyProductToCreate = {
      ...product,
      ...(productTitleEndsWithNumber && {
        title: `${product.title}-0`,
      }),
      vendor: sellerName,
      tags: getValidTags(product.tags),
      variants: product.variants.map((variant) =>
        this.getValidVariantToCreate(variant, weight),
      ),
      options,
      metafields: [
        ...product.metafields,
        getOwnerMetafield(isPro),
        {
          key: 'location',
          value: 'vendor',
          type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
          namespace: BAROODERS_NAMESPACE,
        },
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        ...(product.source
          ? [
              {
                key: 'source',
                value: product.source,
                type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
                namespace: BAROODERS_NAMESPACE,
              },
            ]
          : []),
      ],
    };
    try {
      const createdProduct = await shopifyApiByToken.product.create({
        ...shopifyProductToCreate,
        status: mapShopifyStatus(product.status),
      });
      await this.publishProduct(createdProduct.id.toString());

      if (productTitleEndsWithNumber) {
        await shopifyApiByToken.product.update(createdProduct.id, {
          title: product.title,
        });
      }

      return {
        storeId: new ProductStoreId({ shopifyId: createdProduct.id }),
        handle: createdProduct.handle,
        title: createdProduct.title,
        images: createdProduct.images.map((image) => ({
          src: image.src,
        })),
        variants: createdProduct.variants.map(({ id }) => ({
          storeId: new VariantStoreId({
            shopifyId: id,
          }),
        })),
      };
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      throw new Error(
        `Cannot create product: ${e.message} because ${errorMessage}`,
      );
    }
  }

  async createProductVariant(
    productInternalId: UUID,
    data: Variant,
  ): Promise<VariantCreatedInStore> {
    try {
      const { shopifyId } = await this.prisma.product.findUniqueOrThrow({
        where: { id: productInternalId.uuid },
        select: { shopifyId: true },
      });
      const productShopifyId = Number(shopifyId);

      const { product_type } =
        await shopifyApiByToken.product.get(productShopifyId);
      const {
        attributes: { weight },
      } = await this.pimClient.getPimProductType(product_type);
      const validVariant = await this.getValidVariantToCreate(data, weight);

      const productVariant = await shopifyApiByToken.productVariant.create(
        productShopifyId,
        validVariant,
      );

      return {
        storeId: new VariantStoreId({ shopifyId: productVariant.id }),
      };
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      throw new Error(
        `Cannot create product variant: ${
          e.message
        } because ${errorMessage} (trying to create variant ${jsonStringify(
          data,
        )}`,
      );
    }
  }

  @Retryable({
    backOff: 1_000,
    maxAttempts: 2,
    backOffPolicy: BackOffPolicy.FixedBackOffPolicy,
  })
  async updateProduct(
    { uuid: productId }: UUID,
    { metafields, tags, status, vendorId, ...data }: ProductToUpdate,
  ): Promise<void> {
    try {
      const { shopifyId } = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId },
        select: { shopifyId: true },
      });
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      const newVendor = vendorId
        ? await this.customerRepository.getCustomerFromVendorId(vendorId)
        : null;

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (Object.entries(data).length !== 0 || tags || status || newVendor) {
        await shopifyApiByToken.product.update(Number(shopifyId), {
          ...data,
          ...(tags ? { tags: getValidTags(tags) } : {}),
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          ...(status ? { status: mapShopifyStatus(status) } : {}),
          ...(newVendor ? { vendor: newVendor.sellerName } : {}),
        });
      }

      const metafieldsToUpdate = [
        ...(metafields ?? []),
        ...(newVendor ? [getOwnerMetafield(newVendor.isPro)] : []),
      ];

      if (metafieldsToUpdate.length === 0) return;

      await this.createOrUpdateMetafields(productId, metafieldsToUpdate);
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      throw new Error(
        `Cannot update product (${productId}): ${e.message} because ${errorMessage}`,
      );
    }
  }

  async updateProductVariant(
    { uuid: variantId }: UUID,
    data: Variant,
  ): Promise<void> {
    try {
      const { shopifyId } = await this.prisma.productVariant.findUniqueOrThrow({
        where: { id: variantId },
        select: { shopifyId: true },
      });
      const { inventory_quantity, ...validVariant } = data;

      if (Object.keys(validVariant).length > 0) {
        await shopifyApiByToken.productVariant.update(
          Number(shopifyId),
          validVariant,
        );
      }

      if (inventory_quantity === undefined) return;

      const { inventory_item_id } = await shopifyApiByToken.productVariant.get(
        Number(shopifyId),
      );

      await shopifyApiByToken.inventoryLevel.set({
        location_id: Number(shopifyConfig.shopLocation),
        inventory_item_id,
        available: inventory_quantity,
      });
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      throw new Error(
        `Cannot update product variant (${variantId}) with data (${jsonStringify(
          data,
        )}): ${e.message} because ${errorMessage}`,
      );
    }
  }

  async deleteProductVariant({ uuid: variantId }: UUID): Promise<void> {
    try {
      const {
        shopifyId: variantShopifyId,
        product: { shopifyId: productShopifyId },
      } = await this.prisma.productVariant.findUniqueOrThrow({
        where: { id: variantId },
        select: { shopifyId: true, product: { select: { shopifyId: true } } },
      });
      await shopifyApiByToken.productVariant.delete(
        Number(productShopifyId),
        Number(variantShopifyId),
      );
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      throw new Error(
        `Cannot delete product variant (${variantId}): ${e.message} because ${errorMessage}`,
      );
    }
  }

  async approveProduct(productId: UUID): Promise<void> {
    await this.updateProductStatus(productId, 'approved');
  }

  async rejectProduct(productId: UUID): Promise<void> {
    await this.updateProductStatus(productId, 'denied');
  }

  async cleanOldCommissions(beforeDate: Date): Promise<void> {
    const [firstProduct, ...commissionProducts] =
      await shopifyApiByToken.product.list({
        created_at_max: beforeDate.toISOString(),
        product_type: COMMISSION_TYPE,
        limit: 250,
      });

    this.logger.debug(beforeDate.toISOString());

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!firstProduct) {
      this.logger.debug(`No commission products to delete`);
      return;
    }

    this.logger.debug(
      `Starting to delete ${commissionProducts.length + 1} commission products in Shopify`,
    );

    // Wait for one to see an eventual error, then do the rest without waiting response
    await shopifyApiByToken.product.delete(firstProduct.id);

    commissionProducts.forEach(
      (product) => void shopifyApiByToken.product.delete(product.id),
    );
  }

  async createCommissionProduct(
    product: ProductCreationInput,
  ): Promise<VariantStoreId> {
    const variables: MutationProductCreateArgs = {
      input: {
        title: product.title,
        descriptionHtml: product.description,
        vendor: product.vendor,
        productType: product.productType,
        status: AdminAPIProductStatus.Active,
        variants: product.variants.map((variant) => ({
          inventoryItem: {
            tracked: true,
          },
          inventoryPolicy: ProductVariantInventoryPolicy.Continue,
          price: variant.price.amount,
          requiresShipping: false,
          taxable: true,
        })),
      },
      media: [
        {
          alt: product.title,
          mediaContentType: MediaContentType.Image,
          originalSource: product.featuredImgSrc.url,
        },
      ],
    };

    const response: RequestReturn<Pick<Mutation, 'productCreate'>> = await (
      await this.shopifyApiBySession.getGraphqlClient()
    ).query({
      data: {
        query: `
						mutation productCreate($input: ProductInput!, $media: [CreateMediaInput!]) {
							productCreate(input: $input, media: $media) {
								product {
									id
									legacyResourceId
									variants(first: 1) {
										nodes {
											id
										}
									}
								}
								userErrors {
									field
									message
								}
							}
						}
					`,
        variables,
      },
    });

    const createdProduct = response.body.data.productCreate;

    if (!createdProduct || !createdProduct.product)
      throw new Error('Product not created');

    const commissionProductId = fromStorefrontId(
      createdProduct.product.id,
      'Product',
    );

    await this.publishProduct(commissionProductId);
    this.logger.log(
      `Created product { legacyResourceId: "${createdProduct?.product?.legacyResourceId}" }`,
    );

    const firstVariant = first(createdProduct.product.variants.nodes);

    if (!firstVariant) throw new Error('No variant created for commission');

    return new VariantStoreId({
      shopifyId: Number(fromStorefrontId(firstVariant.id, 'ProductVariant')),
    });
  }

  private async publishProduct(productId: string): Promise<void> {
    const { shopOnlineStorePublicationId, mobileAppPublicationId } =
      shopifyConfig;

    try {
      const variables: MutationPublishablePublishArgs = {
        id: toStorefrontId(productId, 'Product'),
        input: [
          {
            publicationId: shopOnlineStorePublicationId,
          },
          {
            publicationId: mobileAppPublicationId,
          },
        ],
      };

      await (
        await this.shopifyApiBySession.getGraphqlClient()
      ).query({
        data: {
          query: `
							mutation publishablePublish($id: ID!, $input: [PublicationInput!]!) {
								publishablePublish(id: $id, input: $input) {
									publishable {
										availablePublicationCount
										publicationCount
									}
									userErrors {
										field
										message
									}
								}
							}
						`,
          variables,
        },
      });

      this.logger.log(
        `Published product { id: "${productId}" } to Online Store.`,
      );
    } catch (err) {
      this.logger.error((err as Error)?.message, err);
    }
  }

  private getValidVariantToCreate(
    variant: Variant,
    weight: number,
  ): Partial<IProductVariant> {
    const { optionProperties, ...baseVariant } = variant;
    return {
      ...baseVariant,
      option1: optionProperties[0]?.value ?? null,
      option2: optionProperties[1]?.value ?? null,
      option3: optionProperties[2]?.value ?? null,
      compare_at_price:
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        (!Number(variant.compare_at_price)
          ? variant.price
          : variant.compare_at_price) ?? null,
      inventory_management: 'shopify',
      inventory_policy: 'deny',
      weight,
      weight_unit: 'kg',
    };
  }

  private async updateProductStatus({ uuid: productId }: UUID, status: string) {
    const { shopifyId } = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { shopifyId: true },
    });
    const productMetafields = await shopifyApiByToken.metafield.list({
      metafield: {
        owner_resource: 'product',
        owner_id: Number(shopifyId),
      },
      limit: 250,
    });
    const statusMetafield = findMetafield(productMetafields, 'status');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!statusMetafield)
      throw new Error(`Cannot find status metafield for product ${productId}`);

    await shopifyApiByToken.metafield.update(statusMetafield.id, {
      value: status,
    });
  }

  private async createOrUpdateMetafields(
    productId: string,
    metafields: Metafield[],
  ) {
    const metafieldOwner = {
      owner_resource: 'product',
      owner_id: getValidShopifyId(productId),
    };
    try {
      const productMetafields = await shopifyApiByToken.metafield.list({
        metafield: metafieldOwner,
        limit: 250,
      });

      for (const metafield of metafields) {
        await this.createOrUpdateMetafield(
          productMetafields,
          metafieldOwner,
          metafield,
        );
      }
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      throw new Error(
        `Cannot update product (${productId}) metafields (${jsonStringify(
          metafields,
        )}): ${e.message} because ${errorMessage}`,
      );
    }
  }

  private async createOrUpdateMetafield(
    productMetafields: StoredMetafield[],
    metafieldOwner: { owner_resource: string; owner_id: number },
    { key, namespace, value, type }: Metafield,
  ): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!type)
      throw new Error(
        `Cannot create or update metafield without type: ${key} on ${jsonStringify(
          metafieldOwner,
        )}`,
      );

    const existingMetafield = productMetafields.find(
      ({ key: metafieldKey, namespace: metafieldNamespace }) =>
        metafieldKey === key && metafieldNamespace === namespace,
    );

    if (!existingMetafield) {
      await shopifyApiByToken.metafield.create({
        ...metafieldOwner,
        key,
        namespace: BAROODERS_NAMESPACE,
        value,
        type,
      });
      this.logger.warn(
        `Created ${key} metafield (${value}) for ${metafieldOwner.owner_resource}/${metafieldOwner.owner_id}`,
      );

      return;
    }

    if (
      existingMetafield.value === value ||
      Number(existingMetafield.value) === Number(value)
    ) {
      return;
    }

    await shopifyApiByToken.metafield.update(existingMetafield.id, {
      value,
      type,
    });
    this.logger.warn(
      `Updated ${key} from (${existingMetafield.value}) to (${value}) for ${metafieldOwner.owner_resource}/${metafieldOwner.owner_id}`,
    );
  }

  async addProductImage(
    { uuid: productId }: UUID,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    const { shopifyId } = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { shopifyId: true },
    });
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const imageSrc = image.attachment
      ? { attachment: image.attachment.split(',')[1] }
      : // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        image.src
        ? { src: image.src }
        : null;
    if (!imageSrc) {
      throw new Error('Image should have attachment or src key');
    }

    const productImage = await shopifyApiByToken.productImage.create(
      Number(shopifyId),
      {
        position: image.position,
        filename: image.filename,
        ...imageSrc,
      },
    );

    return {
      src: productImage.src,
      storeId: new ImageStoreId({ shopifyId: productImage.id }),
    };
  }
  async deleteProductImage(
    { uuid: productId }: UUID,
    imageId: ImageStoreId,
  ): Promise<void> {
    if (imageId.shopifyIdIfExists == null) {
      return;
    }

    const { shopifyId } = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId },
      select: { shopifyId: true },
    });
    await shopifyApiByToken.productImage.delete(
      Number(shopifyId),
      imageId.shopifyIdIfExists,
    );
  }
}
