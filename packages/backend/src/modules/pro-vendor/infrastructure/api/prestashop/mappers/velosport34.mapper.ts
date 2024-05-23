import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { StockAvailableDTO } from '../dto/prestashop-stock-available.dto';
import { PrestashopDefaultMapper } from './default.mapper';

@Injectable()
export class Velosport34Mapper extends PrestashopDefaultMapper {
  getProductCondition(product: ProductDTO, _tags: string[]): Condition {
    if (this.getTitle(product).toLowerCase().includes('occasion'))
      return Condition.VERY_GOOD;

    return Condition.AS_NEW;
  }

  getQuantity(product: ProductDTO, _variant: StockAvailableDTO | null): number {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return product.description_short
      ?.toLowerCase()
      .includes('disponible à la commande')
      ? 0
      : 1;
  }
}
