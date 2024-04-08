import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { PrestashopDefaultMapper } from './default.mapper';

@Injectable()
export class SEMotionMapper extends PrestashopDefaultMapper {
  getCategoryKey(categoriesSorted: string[], productTitle: string) {
    const lowerTitle = productTitle.toLowerCase();
    const externalCategoryId = super.getCategoryKey(
      categoriesSorted,
      productTitle,
    );

    if (externalCategoryId !== '5/35') return externalCategoryId;
    if (lowerTitle.includes('vtt junior')) return 'vélo-enfant';
    if (lowerTitle.includes('lectrique') && lowerTitle.includes('vtt'))
      return 'vtt-electrique';
    if (lowerTitle.includes('vtt')) return 'vtt';
    if (lowerTitle.includes('lectrique') && lowerTitle.includes('vtc'))
      return 'vtc-electrique';
    if (lowerTitle.includes('vtc')) return 'vtc';

    return externalCategoryId;
  }

  getProductCondition(product: ProductDTO, _tags: string[]): Condition {
    if (this.getTitle(product).toLowerCase().includes('occasion'))
      return Condition.VERY_GOOD;

    return Condition.AS_NEW;
  }
}
