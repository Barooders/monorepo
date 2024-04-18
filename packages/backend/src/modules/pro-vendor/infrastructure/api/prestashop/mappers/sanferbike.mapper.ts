import { Injectable } from '@nestjs/common';
import { first } from 'lodash';
import { PrestashopDefaultMapper } from './default.mapper';

@Injectable()
export class SanferbikeMapper extends PrestashopDefaultMapper {
  getCategoryKey(categoriesSorted: string[], productTitle: string) {
    const externalCategoryId = super.getCategoryKey(
      categoriesSorted,
      productTitle,
    );

    const rootCategoryId =
      first(externalCategoryId.split('/')) ?? externalCategoryId;

    if (['20711'].includes(rootCategoryId)) return 'vélos-de-route';
    if (['11298', '22321', '22061'].includes(rootCategoryId)) return 'gravel';
    if (['20827', '20840'].includes(rootCategoryId)) return 'enduro';
    if (['22843'].includes(rootCategoryId)) return 'vtt-enfant';
    if (['20828', '21030'].includes(rootCategoryId)) return 'vtt';
    if (['21642'].includes(rootCategoryId)) return 'vélos-de-route-électriques';
    if (['21643'].includes(rootCategoryId)) return 'gravel-électriques';
    if (['21641', '20841'].includes(rootCategoryId)) return 'vtt-électriques';
    if (['21644'].includes(rootCategoryId)) return 'vtc-électriques';
    if (['22858', '22425'].includes(rootCategoryId)) return 'vélos-enfant';
    if (['11245'].includes(rootCategoryId)) return 'vtc';
    if (['20839'].includes(rootCategoryId)) return 'vélos-de-trekking';

    return externalCategoryId;
  }
}
