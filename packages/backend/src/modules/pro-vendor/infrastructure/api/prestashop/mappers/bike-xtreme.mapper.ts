import { Injectable } from '@nestjs/common';
import { PrestashopDefaultMapper } from './default.mapper';
import { FirstProductMapped } from '@modules/pro-vendor/domain/service/tag.service';
import { head } from 'lodash';

@Injectable()
export class BikeXtremeMapper extends PrestashopDefaultMapper {
  public async getExtraTags(
    productTitle: string,
    mappingMetadata: FirstProductMapped,
  ): Promise<string[]> {
    const brand = head(productTitle.split(' '));

    return await super.generateSingleTag(
      'brand',
      brand ?? 'first-word-not-found-in-title',
      mappingMetadata,
    );
  }
}
