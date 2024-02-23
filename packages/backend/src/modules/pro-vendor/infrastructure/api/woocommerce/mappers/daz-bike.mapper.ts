import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class DazBikeMapper extends WooCommerceDefaultMapper {
  getVariantQuantity(
    { stock_status }: WooCommerceProduct,
    _variantQuantity: number | null,
  ): number {
    return stock_status === 'outofstock' ? 0 : 1;
  }
}
