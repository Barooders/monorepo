import { Condition, PrismaMainClient } from '@libs/domain/prisma.main.client';
import {
  Product,
  ProductToUpdate,
  Variant,
} from '@libs/domain/product.interface';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { fromCents } from '@libs/helpers/currency';
import { cleanShopifyVariant } from '@libs/infrastructure/shopify/mappers';
import {
  InstrumentedShopify,
  parseShopifyError,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import {
  CreatedProductForSync,
  IStoreClient,
  ProductFromStore,
  VariantToUpdate,
} from '@modules/pro-vendor/domain/ports/store-client';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { ProductCreationService } from '@modules/product/domain/product-creation.service';
import { ProductUpdateService } from '@modules/product/domain/product-update.service';
import { Injectable, Logger } from '@nestjs/common';
import { compact } from 'lodash';
import Shopify from 'shopify-api-node';

const backendAuthor: Author = {
  type: 'backend',
};
@Injectable()
export class StoreClient implements IStoreClient {
  private readonly logger = new Logger(StoreClient.name);

  private shopifyApiByToken: InstrumentedShopify | null = null;

  constructor(
    private readonly vendorConfigService: IVendorConfigService,
    private productCreationService: ProductCreationService,
    private productUpdateService: ProductUpdateService,
    private prisma: PrismaMainClient,
  ) {}

  async createProduct(product: Product): Promise<CreatedProductForSync | null> {
    return await this.productCreationService.createProduct(
      {
        ...product,
        source: `backend:${this.vendorConfigService.getVendorConfig().type}`,
      },
      new UUID({ uuid: this.vendorConfigService.getVendorConfig().vendorId }),
      {},
      backendAuthor,
    );
  }

  async createProductVariant(
    productInternalId: string,
    data: Variant,
  ): Promise<string> {
    return await this.productCreationService.createProductVariant(
      productInternalId,
      data,
      backendAuthor,
    );
  }

  async updateProduct(
    productInternalId: string,
    data: ProductToUpdate,
  ): Promise<void> {
    await this.productUpdateService.updateProduct(
      new UUID({ uuid: productInternalId }),
      data,
      { notifyVendor: false },
      backendAuthor,
    );
  }

  async updateProductVariant(
    variantInternalId: string,
    data: VariantToUpdate,
  ): Promise<void> {
    const { product, id } = await this.getInternalVariant(variantInternalId);

    await this.productUpdateService.updateProductVariant(
      new UUID({ uuid: product.id }),
      new UUID({ uuid: id }),
      data,
      backendAuthor,
    );
  }

  async deleteProductVariant(variantInternalId: string): Promise<void> {
    const { product, id } = await this.getInternalVariant(variantInternalId);

    await this.productUpdateService.deleteProductVariant(
      new UUID({ uuid: product.id }),
      new UUID({ uuid: id }),
      backendAuthor,
    );
  }

  async getProduct(
    productInternalId: string,
  ): Promise<ProductFromStore | null> {
    try {
      const productInDB = await this.prisma.product.findUniqueOrThrow({
        where: {
          id: productInternalId,
        },
        include: {
          variants: true,
          vendor: {
            select: {
              sellerName: true,
            },
          },
        },
      });

      if (productInDB?.shopifyId === null)
        throw new Error('Product not found in Shopify');

      const { title, body_html, product_type, tags, images } =
        await this.getOrCreateShopifyApiByToken().product.get(
          Number(productInDB.shopifyId),
        );

      return {
        title,
        body_html,
        product_type,
        tags: tags.split(', '),
        images: images.map(({ src, id }) => ({
          src,
          shopifyId: id,
        })),
        vendor: productInDB.vendor.sellerName ?? '',
        internalId: productInDB.id,
        status: productInDB.status,
        EANCode: productInDB?.EANCode ?? undefined,
        GTINCode: productInDB?.GTINCode ?? undefined,
        source: productInDB?.source ?? undefined,
        variants: productInDB.variants.map((variant) => ({
          internalId: variant.id,
          price: fromCents(Number(variant.priceInCents)).toString(),
          compare_at_price:
            variant.compareAtPriceInCents === null
              ? null
              : fromCents(Number(variant.compareAtPriceInCents)).toString(),
          inventory_quantity: variant.quantity,
          condition: variant.condition ?? Condition.GOOD,
        })),
      };
    } catch (error) {
      this.logger.debug(
        parseShopifyError(error, 'Product not found in Shopify'),
      );
      return null;
    }
  }

  async getVariantByTitle(
    productInternalId: string,
    variant: Variant,
  ): Promise<string | null> {
    try {
      const shopifyId = await this.getProductShopifyId(productInternalId);

      const title = compact(
        variant.optionProperties.map(({ value }) => value).slice(0, 3),
      ).join(' / ');
      this.logger.debug(`get Product Variant in Shopify with id : ${title}`);
      const variants =
        await this.getOrCreateShopifyApiByToken().productVariant.list(
          shopifyId,
        );
      const matchedVariant = variants
        .map(cleanShopifyVariant)
        .find((variant) => variant.title === title);

      if (matchedVariant === undefined) return null;

      const { id } = await this.prisma.productVariant.findFirstOrThrow({
        where: {
          shopifyId: matchedVariant?.id,
        },
        select: {
          id: true,
        },
      });

      return id;
    } catch (error) {
      this.logger.debug(parseShopifyError(error));
      return null;
    }
  }

  async getProductMetafields(
    productInternalId: string,
  ): Promise<Shopify.IMetafield[]> {
    const shopifyId = await this.getProductShopifyId(productInternalId);

    return await this.getOrCreateShopifyApiByToken().metafield.list({
      metafield: { owner_resource: 'product', owner_id: shopifyId },
      limit: 250,
    });
  }

  async updateProductMetafieldValue(
    metafieldId: number,
    metafieldValue: Shopify.IMetafield['value'],
  ): Promise<Shopify.IMetafield> {
    return await this.getOrCreateShopifyApiByToken().metafield.update(
      metafieldId,
      {
        value: metafieldValue,
      },
    );
  }

  private async getProductShopifyId(productInternalId: string) {
    const productInDB = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productInternalId,
      },
    });

    if (productInDB?.shopifyId === null) {
      throw new Error('Product not found in Shopify');
    }

    return Number(productInDB.shopifyId);
  }

  private async getInternalVariant(variantInternalId: string) {
    return await this.prisma.productVariant.findUniqueOrThrow({
      where: {
        id: variantInternalId,
      },
      include: {
        product: {
          select: {
            id: true,
          },
        },
      },
    });
  }

  private getOrCreateShopifyApiByToken(): InstrumentedShopify {
    if (!!this.shopifyApiByToken) {
      return this.shopifyApiByToken;
    }

    this.shopifyApiByToken = shopifyApiByToken;

    return this.shopifyApiByToken;
  }
}
