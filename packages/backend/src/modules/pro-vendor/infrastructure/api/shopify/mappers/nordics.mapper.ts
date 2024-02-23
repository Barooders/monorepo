import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import {
  getMetafieldValueFromKey,
  ShopifyDefaultMapper,
} from './default.mapper';

@Injectable()
export class NordicsMapper extends ShopifyDefaultMapper {
  async getExternalCategory(
    _shopifyProduct: IProduct,
    productMetafields: IMetafield[],
  ): Promise<string> {
    return String(getMetafieldValueFromKey('Type', productMetafields));
  }

  async getTags(
    shopifyProduct: IProduct,
    productMetafields: IMetafield[],
  ): Promise<(string | null)[]> {
    const defaultTags = await super.getTags(shopifyProduct, productMetafields);

    return [...defaultTags, `marque:${shopifyProduct.vendor}`];
  }
}
