import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class LeHollandaisMapper extends WooCommerceDefaultMapper {
  getProductCondition(
    wooCommerceProduct: WooCommerceProduct,
    _tags: string[],
  ): Condition {
    return this.computeProductConditionTagFromCategories(wooCommerceProduct, [
      'recondition',
      'occasion',
    ]);
  }

  getVariantQuantity(
    { stock_status }: WooCommerceProduct,
    _variantQuantity: number | null,
  ): number {
    if (stock_status === undefined) {
      return 0;
    }

    return ['instock', 'onbackorder'].includes(stock_status) ? 1 : 0;
  }
}
