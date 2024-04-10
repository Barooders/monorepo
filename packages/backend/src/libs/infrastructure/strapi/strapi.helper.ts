import envConfig from '@config/env/env.config';
import {
  PIMCategory,
  PIMDynamicAttribute,
  PIMProductType,
  PimBrand,
} from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { createRestClient } from '../http/clients';

export const strapiClient = createRestClient(
  envConfig.externalServices.strapi.baseUrl,
);

export const getPimProductTypesFromName = async (
  productType: string,
): Promise<PIMProductType[]> => {
  const { data } = await strapiClient<{
    data: PIMProductType[];
  }>(
    `/api/pim-product-types?filters[name][$eq]=${encodeURIComponent(
      productType,
    )}&pagination[limit]=1`,
  );

  return data;
};

export const getPimBrands = async ({
  page,
}: {
  page: number;
}): Promise<{
  data: PimBrand[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}> => {
  const { data, meta } = await strapiClient<{
    data: PimBrand[];
    meta: {
      pagination: {
        pageCount: number;
        pageSize: number;
        page: number;
        total: number;
      };
    };
  }>(
    `/api/pim-brands?` +
      new URLSearchParams({
        'pagination[page]': page.toString(),
        'pagination[pageSize]': '500',
        'fields[0]': 'name',
      }),
  );

  return {
    data,
    pagination: meta.pagination,
  };
};

export const getPimDynamicAttribute = async (
  dynamicAttribute: string,
  tagsObject: Record<string, string[] | undefined>,
): Promise<string[] | null> => {
  const { data } = await strapiClient<{
    data: PIMDynamicAttribute[];
  }>(
    `/api/pim-dynamic-attributes?filters[name][$eq]=${encodeURIComponent(
      dynamicAttribute,
    )}&pagination[limit]=1&populate=pim_product_attributes`,
  );

  if (!data || data.length === 0)
    throw new Error(`Cannot find PIM dynamic attribute: ${dynamicAttribute}`);

  const orderedDynamicAttributes =
    data[0].attributes.pim_product_attributes.data.map(
      ({ attributes: { tagPrefix } }) => tagPrefix,
    );

  for (const attribute of orderedDynamicAttributes) {
    if (tagsObject.hasOwnProperty(attribute)) {
      return tagsObject[attribute] ?? null;
    }
  }

  return null;
};

export const getPimCategoryFromId = async (
  categoryId: number,
): Promise<PIMCategory[]> => {
  const { data } = await strapiClient<{
    data: PIMCategory[];
  }>(
    `/api/pim-categories?filters[id][$eq]=${categoryId}&pagination[limit]=1&populate[productTypes][fields][0]=name`,
  );

  return data;
};

export const createModel = async ({
  name,
  manufacturer_suggested_retail_price,
  imageUrl,
  year,
  brandId,
  isDraft,
}: {
  name: string;
  manufacturer_suggested_retail_price?: number;
  imageUrl: string;
  year: number;
  brandId: number;
  isDraft: boolean;
}): Promise<void> => {
  await strapiClient<{ data: { id: number } }>(`/api/pim-product-models`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${envConfig.externalServices.strapi.apiToken}`,
    },
    body: jsonStringify({
      data: {
        name,
        manufacturer_suggested_retail_price,
        imageUrl,
        year,
        brand: {
          set: [brandId],
        },
        publishedAt: isDraft ? null : undefined,
      },
    }),
  });
};
