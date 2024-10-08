import { Condition } from '@libs/domain/prisma.main.client';
import { SyncProduct } from '@modules/pro-vendor/domain/ports/types';
import { Injectable } from '@nestjs/common';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { PrestashopDefaultMapper } from './default.mapper';

const OCCASION_CATEGORY = '297';
const PROMO_CATEGORY = '292';
const WANTED_CATEGORIES = [PROMO_CATEGORY, OCCASION_CATEGORY];

@Injectable()
export class FunbikeMapper extends PrestashopDefaultMapper {
  async map(product: ProductDTO): Promise<SyncProduct | null> {
    const categories = product.associations?.categories ?? [];
    if (!categories.some(({ id }) => WANTED_CATEGORIES.includes(id))) {
      return null;
    }

    return await super.map(product);
  }

  getProductCondition(product: ProductDTO, _tags: string[]): Condition {
    const categories = product.associations?.categories ?? [];

    return categories.some(({ id }) => id === OCCASION_CATEGORY)
      ? Condition.GOOD
      : Condition.AS_NEW;
  }
}
