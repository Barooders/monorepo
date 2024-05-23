import { Condition, ProductStatus } from '@libs/domain/prisma.main.client';
import {
  ShopifyProductStatus,
  mapCondition,
  mapProductStatus,
} from '@libs/domain/product.interface';
import { CONDITION_TAG_KEY } from '@libs/domain/types';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import {
  SyncLightProduct,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { CategoryService } from '@modules/pro-vendor/domain/service/category.service';
import {
  FirstProductMapped,
  TagService,
} from '@modules/pro-vendor/domain/service/tag.service';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { Injectable, Logger } from '@nestjs/common';
import { head } from 'lodash';
import { IMetafield, IProduct, IProductVariant } from 'shopify-api-node';
import { ShopifyClient } from '../shopify.client';

export const mapMetafieldToBlockList = (
  productMetafields: IMetafield[],
  metafieldKey: string,
  title: string,
) => {
  const metafieldValue = getMetafieldValueFromKey(
    metafieldKey,
    productMetafields,
  );

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return metafieldValue
    ? `<p>${title}:</p><ul>${String(metafieldValue)
        .split('\n')
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        .filter((item) => !!item)
        .map((item) => `<li>${item}</li>`)
        .join('')}</ul><br>`
    : '';
};

export const getMetafieldValueFromKey = (
  metafieldKey: string,
  productMetafields: IMetafield[],
): string | number | undefined => {
  return productMetafields.find(({ key }) => key === metafieldKey)?.value;
};
@Injectable()
export class ShopifyDefaultMapper {
  private readonly logger = new Logger(ShopifyDefaultMapper.name);

  constructor(
    private categoryService: CategoryService,
    private readonly vendorConfigService: IVendorConfigService,
    private shopifyClient: ShopifyClient,
    private tagService: TagService,
    protected pimClient: IPIMClient,
  ) {}

  async mapperLight(shopifyProduct: IProduct): Promise<SyncLightProduct> {
    return {
      external_id: String(shopifyProduct.id),
      isVisibleInStore:
        shopifyProduct.published_at !== null &&
        mapProductStatus(shopifyProduct.status as ShopifyProductStatus) ===
          ProductStatus.ACTIVE,
      title: shopifyProduct.title,
    };
  }

  async mapper(shopifyProduct: IProduct): Promise<SyncProduct | null> {
    const productMetafields = await this.shopifyClient.getProductMetafields(
      shopifyProduct.id,
    );

    const externalCategory = await this.getExternalCategory(
      shopifyProduct,
      productMetafields,
    );

    const productType = await this.categoryService.getOrCreateCategory(
      externalCategory,
      this.vendorConfigService.getVendorConfig().mappingKey,
      externalCategory,
      {
        externalId: String(shopifyProduct.id),
        title: shopifyProduct.title,
      },
    );

    const mappedTags = (await this.getTags(shopifyProduct, productMetafields))
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      .flatMap((f) => (f ? [f] : []));

    const description = await this.getDescription(
      shopifyProduct,
      productMetafields,
      productType,
      mappedTags,
    );

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!productType) {
      this.logger.warn(
        `Category not mapped, skipping product ${shopifyProduct.id}`,
      );
      return null;
    }

    return {
      ...(await this.mapperLight(shopifyProduct)),
      product_type: productType,
      body_html: description,
      variants: shopifyProduct.variants.map((variant) => ({
        external_id: String(variant.id),
        price: variant.price,
        sku: `${shopifyProduct.handle}-${variant.id}`,
        compare_at_price: variant.compare_at_price,
        inventory_quantity: this.getVariantQuantity(variant),
        condition: this.getProductCondition(shopifyProduct, mappedTags),
        optionProperties: [
          {
            key: shopifyProduct.options[0]?.name,
            value: variant.option1,
          },
          {
            key: shopifyProduct.options[1]?.name,
            value: variant.option2,
          },
          {
            key: shopifyProduct.options[2]?.name,
            value: variant.option3,
          },
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        ].filter(({ key, value }) => key && value) as {
          key: string;
          value: string;
        }[],
      })),
      tags: mappedTags,
      images: shopifyProduct.images.map(({ src }) => {
        return { src };
      }),
    };
  }

  getProductCondition(_shopifyProduct: IProduct, tags: string[]): Condition {
    const tagsObject = getTagsObject(tags);

    return mapCondition(head(tagsObject[CONDITION_TAG_KEY]));
  }

  async getExternalCategory(
    shopifyProduct: IProduct,
    _productMetafields: IMetafield[],
  ): Promise<string> {
    return shopifyProduct.tags;
  }

  async getDescription(
    shopifyProduct: IProduct,
    _productMetafields: IMetafield[],
    _productType: string | null,
    _mappedTags: (string | null)[],
  ): Promise<string> {
    return shopifyProduct.body_html;
  }

  getVariantQuantity(variant: IProductVariant): number {
    return variant.inventory_quantity;
  }

  async getTags(
    shopifyProduct: IProduct,
    productMetafields: IMetafield[],
  ): Promise<(string | null)[]> {
    return (
      await Promise.all(
        productMetafields.map(({ key, namespace, value }) => {
          return this.tagService.getOrCreateTag(
            key,
            String(value),
            `${namespace}-${key}`,
            this.vendorConfigService.getVendorConfig().mappingKey,
            {
              externalId: String(shopifyProduct.id),
              title: shopifyProduct.title,
            },
          );
        }),
      )
    ).flat();
  }

  getOrCreateTag(
    key: string,
    value: string,
    mappedProduct: FirstProductMapped,
  ) {
    return this.tagService.getOrCreateTag(
      key,
      value,
      key,
      this.vendorConfigService.getVendorConfig().mappingKey,
      mappedProduct,
    );
  }
}
