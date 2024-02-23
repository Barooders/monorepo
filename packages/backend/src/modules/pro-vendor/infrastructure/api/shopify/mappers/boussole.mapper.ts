import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import {
  getMetafieldValueFromKey,
  ShopifyDefaultMapper,
} from './default.mapper';

@Injectable()
export class BoussoleMapper extends ShopifyDefaultMapper {
  async getExternalCategory(
    _shopifyProduct: IProduct,
    productMetafields: IMetafield[],
  ): Promise<string> {
    return String(getMetafieldValueFromKey('type_title', productMetafields));
  }
}
