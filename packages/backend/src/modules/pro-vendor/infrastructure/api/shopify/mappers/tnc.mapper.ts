import {
  NEW_PRODUCT_DEFAULT_DESCRIPTION,
  USED_PRODUCT_DEFAULT_DESCRIPTION,
} from '@config/vendor/constants';
import { Condition } from '@libs/domain/prisma.main.client';
import { SkippedProductException } from '@modules/pro-vendor/domain/exception/skipped-product.exception';
import { BIKE_PRODUCT_TYPES } from '@modules/pro-vendor/domain/ports/types';
import { Injectable } from '@nestjs/common';
import { nth } from 'lodash';
import { IMetafield, IProduct } from 'shopify-api-node';
import { ShopifyDefaultMapper } from './default.mapper';

@Injectable()
export class TNCMapper extends ShopifyDefaultMapper {
  async getExternalCategory(
    shopifyProduct: IProduct,
    _productMetafields: IMetafield[],
  ): Promise<string> {
    return [
      shopifyProduct.product_type,
      shopifyProduct.product_type === 'Polyvalent'
        ? shopifyProduct.tags
            .split(', ')
            .filter((tag) => !tag.startsWith('C:'))
            .sort()
            .join(' - ')
        : '',
      shopifyProduct.title.toLowerCase().includes('lectrique') ||
      shopifyProduct.title.toLowerCase().includes('vttae')
        ? 'électrique'
        : '',
    ].join(' - ');
  }

  getDescription(
    shopifyProduct: IProduct,
    _productMetafields: IMetafield[],
    productType: string | null,
  ): string {
    if (productType && BIKE_PRODUCT_TYPES.includes(productType.toLowerCase()))
      return shopifyProduct.body_html;

    const noteBlock = shopifyProduct.body_html.match(
      /<(strong|span|em)>((attention|note)[^<]*)</im,
    );

    return [
      nth(noteBlock, 2),
      this.getProductCondition(shopifyProduct, []) === Condition.VERY_GOOD
        ? USED_PRODUCT_DEFAULT_DESCRIPTION
        : NEW_PRODUCT_DEFAULT_DESCRIPTION,
    ]
      .filter(Boolean)
      .join('<br />');
  }

  async getTags(
    shopifyProduct: IProduct,
    productMetafields: IMetafield[],
  ): Promise<(string | null)[]> {
    const filteredMetafields = productMetafields.filter(
      ({ key }) => !['shortDescription', 'widget', 'title_tag'].includes(key),
    );

    const defaultTags = await super.getTags(shopifyProduct, filteredMetafields);
    const attributesInTags = (
      await Promise.all(
        shopifyProduct.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag.startsWith('C:'))
          .map((tag) => tag.replace('C:', ''))
          .map(async (tag) => {
            const [key, value] = tag.split(':');

            return await super.getOrCreateTag(key, value, {
              externalId: String(shopifyProduct.id),
              title: shopifyProduct.title,
            });
          }),
      )
    ).flat();

    if (
      this.getProductCondition(shopifyProduct, []) === Condition.AS_NEW &&
      ['atomic', 'salomon'].includes(shopifyProduct.vendor.toLowerCase())
    ) {
      throw new SkippedProductException(
        String(shopifyProduct.id),
        `Product is not second hand and is from a brand that is not allowed (${shopifyProduct.vendor})`,
      );
    }

    return [
      ...defaultTags,
      ...attributesInTags,
      `marque:${shopifyProduct.vendor}`,
      `modele:${shopifyProduct.title}`,
    ];
  }

  public getProductCondition(
    shopifyProduct: IProduct,
    _mappedTags: string[],
  ): Condition {
    return !shopifyProduct.title.toLowerCase().includes('neuf')
      ? Condition.VERY_GOOD
      : Condition.AS_NEW;
  }
}
