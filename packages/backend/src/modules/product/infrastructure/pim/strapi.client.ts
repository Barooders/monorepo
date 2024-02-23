import { PIMProductType } from '@libs/domain/types';
import { getPimProductTypesFromName } from '@libs/infrastructure/strapi/strapi.helper';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StrapiClient implements IPIMClient {
  async getPimProductType(productType: string): Promise<PIMProductType> {
    const results = await getPimProductTypesFromName(productType);

    return results[0];
  }

  async checkIfProductTypeExists(productType: string): Promise<void> {
    const results = await getPimProductTypesFromName(productType);

    if (results.length === 0) {
      throw new Error(`Product type ${productType} does not exist in PIM`);
    }
  }
}
