import { PIMProductType } from '@libs/domain/types';
import { getPimProductTypesFromName } from '@libs/infrastructure/strapi/strapi.helper';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { Injectable } from '@nestjs/common';
import { head } from 'lodash';

@Injectable()
export class StrapiClient implements IPIMClient {
  async getPimProductType(productType: string): Promise<PIMProductType> {
    const results = await getPimProductTypesFromName(productType);
    const firstMatch = head(results);

    if (!firstMatch) {
      throw new Error(`Product type ${productType} does not exist in PIM`);
    }

    return firstMatch;
  }

  async checkIfProductTypeExists(productType: string): Promise<void> {
    await this.getPimProductType(productType);
  }
}
