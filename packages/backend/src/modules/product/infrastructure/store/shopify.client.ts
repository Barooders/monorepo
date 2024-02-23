import { shopifyConfig } from '@config/shopify.config';
import { CustomerRepository } from '@libs/domain/customer.repository';
import {
  Condition,
  PrismaMainClient,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import {
  getVariantsOptions,
  mapCondition,
  Metafield,
  ProductToStore,
  ProductToUpdate,
  ShopifyProductStatus,
  StoredMetafield,
  StoredProduct,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';
import {
  BAROODERS_NAMESPACE,
  getValidTags,
  MetafieldType,
} from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import {
  cleanShopifyProduct,
  cleanShopifyVariant,
} from '@libs/infrastructure/shopify/mappers';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import {
  findMetafield,
  parseShopifyError,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import {
  getValidShopifyId,
  getValidVariantToCreate,
  getValidVariantToUpdate,
} from '@libs/infrastructure/shopify/validators';
import { IStoreClient } from '@modules/product/domain/ports/store.client';
import { ImageToUpload, ProductImage } from '@modules/product/domain/types';
import { Injectable, Logger } from '@nestjs/common';
import { MutationPublishablePublishArgs } from '@quasarwork/shopify-api-types/api/admin/2023-04';
import { get } from 'lodash';

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
  ) {}

  async getProductDetails(productId: string): Promise<StoredProduct> {
    const product = await shopifyApiByToken.product.get(
      getValidShopifyId(productId),
    );

    const storeProduct = cleanShopifyProduct(product);

    return {
      ...storeProduct,
      variants: await Promise.all(
        storeProduct.variants.map((variant) => {
          return this.enrichVariantWithCondition(variant);
        }),
      ),
    };
  }

  async createProduct(product: ProductToStore): Promise<StoredProduct> {
    const customer = await this.customerRepository.getCustomerFromVendorId(
      product.vendorId,
    );

    if (!customer)
      throw new Error(`Cannot find vendor with id: ${product.vendorId}`);

    const { sellerName, isPro } = customer;

    const options = getVariantsOptions(product.variants);

    const shopifyProductToCreate = {
      ...product,
      vendor: sellerName,
      tags: getValidTags(product.tags),
      variants: product.variants.map(getValidVariantToCreate),
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

      const cleanProduct = cleanShopifyProduct(createdProduct);

      return {
        ...cleanProduct,
        EANCode: product.EANCode,
        GTINCode: product.GTINCode,
        source: product.source,
        variants: cleanProduct.variants.map((variant, index) => ({
          ...variant,
          //TODO: stop using index here as shopify can return variants in different order
          condition:
            get(product.variants, `[${index}].condition`) ?? Condition.GOOD,
        })),
      };
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      this.logger.error(errorMessage, e);
      throw new Error(
        `Cannot create product: ${e.message} because ${errorMessage}`,
      );
    }
  }

  async createProductVariant(
    productId: number,
    data: Variant,
  ): Promise<StoredVariant> {
    try {
      const productVariant = await shopifyApiByToken.productVariant.create(
        productId,
        getValidVariantToCreate(data),
      );
      return {
        ...cleanShopifyVariant(productVariant),
        condition: data.condition,
      };
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      this.logger.error(errorMessage, e);
      throw new Error(
        `Cannot create product variant: ${
          e.message
        } because ${errorMessage} (trying to create variant ${jsonStringify(
          data,
        )}`,
      );
    }
  }

  async updateProduct(
    productId: string,
    { metafields, tags, status, vendorId, ...data }: ProductToUpdate,
  ): Promise<void> {
    try {
      const newVendor = vendorId
        ? await this.customerRepository.getCustomerFromVendorId(vendorId)
        : null;

      if (Object.entries(data).length !== 0 || tags || status || newVendor) {
        const shopifyId = getValidShopifyId(productId);
        await shopifyApiByToken.product.update(shopifyId, {
          ...data,
          ...(tags ? { tags: getValidTags(tags) } : {}),
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
      this.logger.error(errorMessage, e);
      throw new Error(
        `Cannot update product (${productId}): ${e.message} because ${errorMessage}`,
      );
    }
  }

  async updateProductVariant(variantId: string, data: Variant): Promise<void> {
    try {
      const { inventory_quantity, ...validVariant } =
        getValidVariantToUpdate(data);

      if (Object.keys(validVariant).length > 0) {
        await shopifyApiByToken.productVariant.update(
          getValidShopifyId(variantId),
          validVariant,
        );
      }

      if (inventory_quantity === undefined) return;

      const { inventory_item_id } = await shopifyApiByToken.productVariant.get(
        getValidShopifyId(variantId),
      );

      await shopifyApiByToken.inventoryLevel.set({
        location_id: Number(shopifyConfig.shopLocation),
        inventory_item_id,
        available: inventory_quantity,
      });
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      this.logger.error(errorMessage, e);
      throw new Error(
        `Cannot update product variant (${variantId}) with data (${jsonStringify(
          data,
        )}): ${e.message} because ${errorMessage}`,
      );
    }
  }

  async deleteProductVariant(
    productShopifyId: string,
    variantShopifyId: string,
  ): Promise<void> {
    try {
      await shopifyApiByToken.productVariant.delete(
        getValidShopifyId(productShopifyId),
        getValidShopifyId(variantShopifyId),
      );
    } catch (e: any) {
      const errorMessage = parseShopifyError(e);
      this.logger.error(errorMessage, e);
      throw new Error(
        `Cannot delete product variant (${variantShopifyId}): ${e.message} because ${errorMessage}`,
      );
    }
  }

  async publishProductInMobileChannel(productId: string): Promise<void> {
    const variables: MutationPublishablePublishArgs = {
      id: `gid://shopify/Product/${productId}`,
      input: [
        {
          publicationId: shopifyConfig.mobileAppPublicationId,
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

    this.logger.debug(
      `Published product (${productId}) to Mobile/App sales channel.`,
    );
  }

  async approveProduct(productId: string): Promise<void> {
    await this.updateProductStatus(productId, 'approved');
  }

  async rejectProduct(productId: string): Promise<void> {
    await this.updateProductStatus(productId, 'denied');
  }

  private async enrichVariantWithCondition(
    variant: Omit<StoredVariant, 'condition'>,
  ): Promise<StoredVariant> {
    const dbVariant = await this.prisma.productVariant.findFirst({
      where: { shopifyId: variant.id },
      select: { condition: true },
    });

    return {
      ...variant,
      condition: mapCondition(dbVariant?.condition),
    };
  }

  private async updateProductStatus(productId: string, status: string) {
    const productMetafields = await shopifyApiByToken.metafield.list({
      metafield: {
        owner_resource: 'product',
        owner_id: getValidShopifyId(productId),
      },
      limit: 250,
    });
    const statusMetafield = findMetafield(productMetafields, 'status');

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
      this.logger.error(errorMessage, e);
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
    productId: string,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    const productImage = await shopifyApiByToken.productImage.create(
      Number(productId),
      {
        position: image.position,
        filename: image.filename,
        attachment: image.attachment.split(',')[1],
      },
    );

    return { src: productImage.src, id: productImage.id.toString() };
  }
  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    await shopifyApiByToken.productImage.delete(
      Number(productId),
      Number(imageId),
    );
  }
}
