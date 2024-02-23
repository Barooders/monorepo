import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import {
  getMetafieldValueFromKey,
  ShopifyDefaultMapper,
} from './default.mapper';

@Injectable()
export class TCHMapper extends ShopifyDefaultMapper {
  async getExternalCategory(
    shopifyProduct: IProduct,
    _productMetafields: IMetafield[],
  ): Promise<string> {
    return (
      shopifyProduct.tags
        .split(', ')
        .map((x) => x.toLowerCase())
        .find((tag) => tag.startsWith('catégorie_')) ??
      shopifyProduct.product_type
    );
  }

  getDescription(
    shopifyProduct: IProduct,
    productMetafields: IMetafield[],
    _productType: string | null,
  ): string {
    const upgradesText = getMetafieldValueFromKey(
      'ameliorations',
      productMetafields,
    );

    return `${shopifyProduct.body_html}<br>${upgradesText}`;
  }
}
