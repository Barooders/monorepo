import { Condition } from '@libs/domain/prisma.main.client';
import { mapCondition } from '@libs/domain/product.interface';
import { CONDITION_TAG_KEY } from '@libs/domain/types';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import { Injectable } from '@nestjs/common';
import { head } from 'lodash';
import { ProductDTO } from '../dto/prestashop-product.dto';
import { PrestashopDefaultMapper } from './default.mapper';

@Injectable()
export class FreeglisseMapper extends PrestashopDefaultMapper {
  getCategoryKey(categoriesSorted: number[], productTitle: string) {
    const lowerTitle = productTitle.toLowerCase();
    const externalCategoryId = super.getCategoryKey(
      categoriesSorted,
      productTitle,
    );

    if (lowerTitle.includes('vtt junior')) return 'vélo-enfant';
    if (lowerTitle.includes('lectrique') && lowerTitle.includes('vtt'))
      return 'vtt-electrique';
    if (lowerTitle.includes('vtt')) return 'vtt';

    return externalCategoryId;
  }

  getProductCondition(product: ProductDTO, tags: string[]): Condition {
    if (this.getTitle(product).toLowerCase().includes('occasion'))
      return Condition.VERY_GOOD;

    const tagsObject = getTagsObject(tags);
    return mapCondition(head(tagsObject[CONDITION_TAG_KEY]));
  }
}
