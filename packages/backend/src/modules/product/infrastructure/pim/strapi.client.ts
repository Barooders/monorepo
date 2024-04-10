import {
  PIMCategory,
  PIMProductType,
  PimBrand,
  PimProductModel,
} from '@libs/domain/types';
import {
  createModel,
  getPimBrands,
  getPimCategoryFromId,
  getPimProductTypesFromName,
} from '@libs/infrastructure/strapi/strapi.helper';
import {
  PIM_CATEGORY_CACHE_TTL_IN_MILLISECONDS,
  PIM_PRODUCT_TYPE_CACHE_TTL_IN_MILLISECONDS,
  BIKE_CATEGORY_ID as STRAPI_BIKE_CATEGORY_ID,
} from '@modules/product/constants';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { CreateProductModel } from '@modules/product/domain/types';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import Fuse from 'fuse.js';
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

  async createProductModel(
    model: CreateProductModel,
  ): Promise<PimProductModel> {
    const pimBrand = await this.getBrand(model.brand.name);

    const { id } = await createModel({
      name: model.name,
      manufacturer_suggested_retail_price:
        model.manufacturer_suggested_retail_price,
      imageUrl: model.imageUrl,
      year: model.year,
      brandId: pimBrand.id,
      isDraft: true,
    });

    return {
      id: id.toString(),
      name: model.name,
      manufacturer_suggested_retail_price:
        model.manufacturer_suggested_retail_price,
      imageUrl: new URL(model.imageUrl),
      year: model.year,
      brand: {
        name: pimBrand.name,
      },
    };
  }

  private async getBrand(
    brandName: string,
  ): Promise<{ id: number; name: string }> {
    const brands = await this.getBrands();

    const index = new Fuse(brands, {
      keys: ['attributes.name'],
      threshold: 0.2,
    });

    const brand = index.search(brandName, {
      limit: 1,
    })[0];

    if (!brand) {
      throw new Error(`Brand ${brandName} does not exist in PIM`);
    }

    return { id: brand.item.id, name: brand.item.attributes.name };
  }

  private async getBrands(): Promise<PimBrand[]> {
    const CACHE_KEY = `pim-brands`;
    const cachedBrands = await this.cacheManager.get<PimBrand[]>(CACHE_KEY);

    if (cachedBrands) {
      return cachedBrands;
    }

    let page = 1;
    let results: PimBrand[] = [];
    let pageCount: number | null = null;
    do {
      const { data, pagination } = await getPimBrands({ page });
      results = [...results, ...data];
      page = pagination.page + 1;
      pageCount = pagination.pageCount;
    } while (page <= pageCount);

    await this.cacheManager.set(
      CACHE_KEY,
      results,
      PIM_PRODUCT_TYPE_CACHE_TTL_IN_MILLISECONDS,
    );

    return results;
  }
}
