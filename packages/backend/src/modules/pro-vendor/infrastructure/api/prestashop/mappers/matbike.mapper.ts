import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { StockAvailableDTO } from '../dto/prestashop-stock-available.dto';
import { PrestashopDefaultMapper } from './default.mapper';

@Injectable()
export class MatbikeMapper extends PrestashopDefaultMapper {
  getProductCondition(product: ProductDTO, _tags: string[]): Condition {
    if (this.getTitle(product).toLowerCase().includes('occasion'))
      return Condition.VERY_GOOD;

    return Condition.AS_NEW;
  }

  getQuantity(_product: ProductDTO, variant: StockAvailableDTO | null): number {
    return variant?.quantity ? Number(variant.quantity) : 1;
  }
}
