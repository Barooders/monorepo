import { PIMCategory, PIMProductType } from '@libs/domain/types';
import {
  getPimCategoryFromId,
  getPimProductTypesFromName,
} from '@libs/infrastructure/strapi/strapi.helper';
import {
  PIM_CATEGORY_CACHE_TTL_IN_MILLISECONDS,
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
    const cacheKey = `pim-product-type_${productType}`;

    const cachedPimProductType =
      await this.cacheManager.get<PIMProductType>(cacheKey);

    if (cachedPimProductType) {
      return cachedPimProductType;
    }

    const results = await getPimProductTypesFromName(productType);
    const firstMatch = head(results);

    if (!firstMatch) {
      throw new Error(`Product type ${productType} does not exist in PIM`);
    }

    await this.cacheManager.set(
      cacheKey,
      firstMatch,
      PIM_PRODUCT_TYPE_CACHE_TTL_IN_MILLISECONDS,
    );

    return firstMatch;
  }

  async checkIfProductTypeExists(productType: string): Promise<void> {
    await this.getPimProductType(productType);
  }

  async isBike(productType: string): Promise<boolean> {
    const bikeCategory = await this.getPimCategory(STRAPI_BIKE_CATEGORY_ID);

    const bikeProductTypes = bikeCategory.attributes.productTypes.data.map(
      (type) => type.attributes.name.toLowerCase(),
    );

    return bikeProductTypes.includes(productType.toLowerCase());
  }

  private async getPimCategory(categoryId: number) {
    const cacheKey = `pim-category_${categoryId}`;
    const cachedPimCategory =
      await this.cacheManager.get<PIMCategory>(cacheKey);

    if (cachedPimCategory) {
      return cachedPimCategory;
    }

    const results = await getPimCategoryFromId(categoryId);
    const firstMatch = results[0];

    if (!firstMatch) {
      throw new Error(`Category ${categoryId} does not exist in PIM`);
    }

    await this.cacheManager.set(
      cacheKey,
      firstMatch,
      PIM_CATEGORY_CACHE_TTL_IN_MILLISECONDS,
    );

    return firstMatch;
  }
}
