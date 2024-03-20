import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class FastlapMapper extends WooCommerceDefaultMapper {
  getCategory(wooCommerceProduct: WooCommerceProduct): {
    key: string;
    name: string;
  } {
    const key = wooCommerceProduct.attributes
      .find((a) => a.name.toLowerCase() === 'tipo')
      ?.options.sort()
      .join('-');

    if (!key) {
      return { key: 'unknown', name: 'unknown' };
    }

    return {
      key,
      name: key,
    };
  }

  getVariantQuantity(
    { stock_status }: WooCommerceProduct,
    _variantQuantity: number | null,
  ): number {
    return stock_status === 'outofstock' ? 0 : 1;
  }
}
