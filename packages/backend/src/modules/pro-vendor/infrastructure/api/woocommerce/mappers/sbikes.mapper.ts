import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { WooCommerceProduct } from '../types';
import { WooCommerceDefaultMapper } from './default.mapper';

@Injectable()
export class SBikesMapper extends WooCommerceDefaultMapper {
  getCategory(wooCommerceProduct: WooCommerceProduct): {
    key: string;
    name: string;
  } {
    const key = wooCommerceProduct.attributes
      .find((a) => a.name.toLowerCase() === 'type fiets')
      ?.options.sort()
      .join('-');

    if (!key) {
      return super.getCategory(wooCommerceProduct);
    }

    return {
      key,
      name: key,
    };
  }

  getProductCondition(
    wooCommerceProduct: WooCommerceProduct,
    _tags: string[],
  ): Condition {
    return this.computeProductConditionTagFromCategories(
      wooCommerceProduct,
      ['tweedehands'],
      Condition.GOOD,
    );
  }
}
