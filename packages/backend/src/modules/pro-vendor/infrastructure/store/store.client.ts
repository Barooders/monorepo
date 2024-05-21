import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import {
  mapCondition,
  Product,
  ProductToUpdate,
  StoredProduct,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import {
  cleanShopifyProduct,
  cleanShopifyVariant,
} from '@libs/infrastructure/shopify/mappers';
import {
  InstrumentedShopify,
  parseShopifyError,
  shopifyApiByToken,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import {
  IStoreClient,
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

  async createProduct(product: Product): Promise<StoredProduct | null> {
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
    product_id: number,
    data: Variant,
  ): Promise<StoredVariant> {
    return await this.productCreationService.createProductVariant(
      product_id,
      data,
      backendAuthor,
    );
  }

  async updateProduct(
    product_id: number,
    data: ProductToUpdate,
  ): Promise<void> {
    const { id } = await this.prisma.product.findUniqueOrThrow({
      where: {
        shopifyId: product_id,
      },
    });
    await this.productUpdateService.updateProduct(
      {
        id,
        storeId: product_id.toString(),
      },
      data,
      { notifyVendor: false },
      backendAuthor,
    );
  }

  async updateProductVariant(
    variant_id: number,
    data: VariantToUpdate,
  ): Promise<void> {
    const { product, id } = await this.getInternalVariant(variant_id);

    await this.productUpdateService.updateProductVariant(
      {
        id: product.id,
        storeId: product.shopifyId.toString(),
      },
      {
        id: id,
        storeId: variant_id.toString(),
      },
      data,
      backendAuthor,
    );
  }

  async deleteProductVariant(variantShopifyId: number): Promise<void> {
    const { product, id } = await this.getInternalVariant(variantShopifyId);

    await this.productUpdateService.deleteProductVariant(
      {
        id: product.id,
        storeId: product.shopifyId.toString(),
      },
      {
        id: id,
        storeId: variantShopifyId.toString(),
      },
      backendAuthor,
    );
  }

  async getProduct(productId: number): Promise<StoredProduct | null> {
    try {
      const product =
        await this.getOrCreateShopifyApiByToken().product.get(productId);
      const productInDB = await this.prisma.product.findUniqueOrThrow({
        where: {
          shopifyId: productId,
        },
      });

      const cleanProduct = cleanShopifyProduct(product);

      return {
        ...cleanProduct,
        internalId: productInDB.id,
        EANCode: productInDB?.EANCode ?? undefined,
        GTINCode: productInDB?.GTINCode ?? undefined,
        source: productInDB?.source ?? undefined,
        variants: await Promise.all(
          cleanProduct.variants.map((variant) => {
            return this.enrichVariantWithCondition(variant);
          }),
        ),
      };
    } catch (error) {
      this.logger.debug(
        parseShopifyError(error, 'Product not found in Shopify'),
      );
      return null;
    }
  }

  async getVariantByTitle(
    product_id: number,
    variant: Variant,
  ): Promise<StoredVariant | null> {
    try {
      const title = compact(
        variant.optionProperties.map(({ value }) => value).slice(0, 3),
      ).join(' / ');
      this.logger.debug(`get Product Variant in Shopify with id : ${title}`);
      const variants =
        await this.getOrCreateShopifyApiByToken().productVariant.list(
          product_id,
        );
      const matchedVariant = variants
        .map(cleanShopifyVariant)
        .find((variant) => variant.title === title);

      return matchedVariant
        ? await this.enrichVariantWithCondition(matchedVariant)
        : null;
    } catch (error) {
      this.logger.debug(parseShopifyError(error));
      return null;
    }
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

  async getProductMetafields(productId: number): Promise<Shopify.IMetafield[]> {
    return await this.getOrCreateShopifyApiByToken().metafield.list({
      metafield: { owner_resource: 'product', owner_id: productId },
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

  private async getInternalVariant(variantShopifyId: number) {
    return await this.prisma.productVariant.findUniqueOrThrow({
      where: {
        shopifyId: variantShopifyId,
      },
      include: {
        product: true,
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
