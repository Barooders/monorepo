import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import {
  mapMetafieldToBlockList,
  ShopifyDefaultMapper,
} from './default.mapper';

@Injectable()
export class LoewiMapper extends ShopifyDefaultMapper {
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

  getDescription(
    _shopifyProduct: IProduct,
    productMetafields: IMetafield[],
    _productType: string | null,
    _mappedTags: (string | null)[],
  ): string {
    return [
      mapMetafieldToBlockList(
        productMetafields,
        'description_test',
        'Caractéristiques générales',
      ),
      mapMetafieldToBlockList(
        productMetafields,
        'caract_ristiques_lectriques',
        'Caractéristiques électriques',
      ),
      mapMetafieldToBlockList(
        productMetafields,
        'caract_ristiques_m_caniques',
        'Caractéristiques mécaniques',
      ),
    ].join('');
  }
}
