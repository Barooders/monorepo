import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import {
  ShopifyDefaultMapper,
  getMetafieldValueFromKey,
} from './default.mapper';

@Injectable()
export class TuvalumV2Mapper extends ShopifyDefaultMapper {
  async getExternalCategory(
    { product_type }: IProduct,
    productMetafields: IMetafield[],
  ): Promise<string> {
    return `${product_type} - ${getMetafieldValueFromKey('custitem_family', productMetafields)}`;
  }
}
