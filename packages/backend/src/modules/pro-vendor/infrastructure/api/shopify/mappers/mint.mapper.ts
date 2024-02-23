import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import {
  getMetafieldValueFromKey,
  mapMetafieldToBlockList,
  ShopifyDefaultMapper,
} from './default.mapper';

@Injectable()
export class MintMapper extends ShopifyDefaultMapper {
  getDescription(
    shopifyProduct: IProduct,
    productMetafields: IMetafield[],
    _productType: string | null,
  ): string {
    const positivePointsText = mapMetafieldToBlockList(
      productMetafields,
      'pospoints',
      'Points forts',
    );
    const newItemsText = mapMetafieldToBlockList(
      productMetafields,
      'piece9',
      'Pièces neuves',
    );
    const negativePointsText = mapMetafieldToBlockList(
      productMetafields,
      'negpoints',
      'Défaults visuels',
    );

    return `${shopifyProduct.body_html}<br>${positivePointsText}${newItemsText}${negativePointsText}`;
  }

  async getExternalCategory(
    shopifyProduct: IProduct,
    productMetafields: IMetafield[],
  ): Promise<string> {
    const isElectrique = shopifyProduct.body_html
      .toLowerCase()
      .includes('électrique');

    return `${getMetafieldValueFromKey(
      'type_de_pratique',
      productMetafields,
    )} - ${isElectrique ? 'électrique' : 'musculaire'}`;
  }
}
