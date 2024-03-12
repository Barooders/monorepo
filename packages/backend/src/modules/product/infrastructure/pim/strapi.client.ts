import { PIMProductType } from '@libs/domain/types';
import { getPimProductTypesFromName } from '@libs/infrastructure/strapi/strapi.helper';
import {
  PIM_PRODUCT_TYPE_CACHE_TTL_IN_MILLISECONDS,
  BIKE_CATEGORY_ID as STRAPI_BIKE_CATEGORY_ID,
} from '@modules/product/constants';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { head } from 'lodash';

@Injectable()
export class StrapiClient implements IPIMClient {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getPimProductType(productType: string): Promise<PIMProductType> {
    const cachedPimProductType = await this.cacheManager.get<PIMProductType>(
      `pim-product-type_${productType}`,
    );

    if (cachedPimProductType) {
      return cachedPimProductType;
    }

    const results = await getPimProductTypesFromName(productType);
    const firstMatch = head(results);

    if (!firstMatch) {
      throw new Error(`Product type ${productType} does not exist in PIM`);
    }

    await this.cacheManager.set(
      `pim-product-type_${productType}`,
      firstMatch,
      PIM_PRODUCT_TYPE_CACHE_TTL_IN_MILLISECONDS,
    );

    return firstMatch;
  }

  async checkIfProductTypeExists(productType: string): Promise<void> {
    await this.getPimProductType(productType);
  }

  async isBike(productType: string): Promise<boolean> {
    const pimProductType = await this.getPimProductType(productType);

    return pimProductType.attributes.categories.data.some(
      (category) => category.id === STRAPI_BIKE_CATEGORY_ID,
    );
  }
}
