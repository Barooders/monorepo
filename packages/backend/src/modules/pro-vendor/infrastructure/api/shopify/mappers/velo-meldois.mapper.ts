import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct, IProductVariant } from 'shopify-api-node';
import { ShopifyDefaultMapper } from './default.mapper';

@Injectable()
export class VeloMeldoisMapper extends ShopifyDefaultMapper {
  getVariantQuantity(_variant: IProductVariant): number {
    return 1;
  }

  async getExternalCategory(
    { product_type }: IProduct,
    _productMetafields: IMetafield[],
  ): Promise<string> {
    return product_type;
  }
}
