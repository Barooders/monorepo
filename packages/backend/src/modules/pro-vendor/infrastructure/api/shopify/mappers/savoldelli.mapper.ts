import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import { ShopifyDefaultMapper } from './default.mapper';

@Injectable()
export class SavoldelliMapper extends ShopifyDefaultMapper {
  async getExternalCategory(
    { product_type }: IProduct,
    _productMetafields: IMetafield[],
  ): Promise<string> {
    return product_type;
  }

  async getTags(
    shopifyProduct: IProduct,
    productMetafields: IMetafield[],
  ): Promise<(string | null)[]> {
    const defaultTags = await super.getTags(shopifyProduct, productMetafields);

    return [...defaultTags, `marque:${shopifyProduct.vendor}`];
  }
}
