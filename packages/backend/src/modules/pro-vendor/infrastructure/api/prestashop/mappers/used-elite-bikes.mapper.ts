import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { PrestashopDefaultMapper } from './default.mapper';

const NEW_KEYWORD = 'Neu';

@Injectable()
export class UsedEliteBikesMapper extends PrestashopDefaultMapper {
  getProductCondition(product: ProductDTO): Condition {
    if (product.name?.endsWith(` ${NEW_KEYWORD}`)) return Condition.AS_NEW;

    return Condition.VERY_GOOD;
  }
}
