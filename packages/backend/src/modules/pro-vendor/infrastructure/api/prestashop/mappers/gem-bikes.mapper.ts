import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { PrestashopDefaultMapper } from './default.mapper';

const USED_CATEGORY = '9';

@Injectable()
export class GemBikesMapper extends PrestashopDefaultMapper {
  getProductCondition(product: ProductDTO): Condition {
    const categories = product.associations?.categories ?? [];
    if (categories.some(({ id }) => id === USED_CATEGORY))
      return Condition.VERY_GOOD;

    return Condition.AS_NEW;
  }
}
