import envConfig from '@config/env/env.config';
import {
  PIMCategory,
  PIMDynamicAttribute,
  PIMProductType,
} from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { NewBrand } from '@modules/product/domain/types';
import { createRestClient } from '../http/clients';

export const strapiClient = createRestClient(
  envConfig.externalServices.strapiBaseUrl,
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

export const createBrand = async ({
  name,
}: NewBrand): Promise<{ id: number }> => {
  const response = await strapiClient<{ data: { id: number } }>(
    `/api/pim-brands`,
    {
      method: 'POST',
      body: jsonStringify({
        data: {
          name,
        },
      }),
    },
  );

  return response.data;
};

export const createFamily = async (
  name: string,
  brandId: number,
  productTypeId: number,
): Promise<{ id: number }> => {
  const response = await strapiClient<{ data: { id: number } }>(
    `/api/pim-product-families`,
    {
      method: 'POST',
      body: jsonStringify({
        data: {
          name,
          brand: {
            set: [brandId],
          },
          productType: {
            set: [productTypeId],
          },
        },
      }),
    },
  );

  return response.data;
};

export const createModel = async ({
  name,
  manufacturer_suggested_retail_price,
  imageUrl,
  year,
  familyId,
}: {
  name: string;
  manufacturer_suggested_retail_price?: number;
  imageUrl: string;
  year: number;
  familyId: number;
}): Promise<void> => {
  await strapiClient<{ data: { id: number } }>(`/api/pim-product-models`, {
    method: 'POST',
    body: jsonStringify({
      data: {
        name,
        manufacturer_suggested_retail_price,
        imageUrl,
        year,
        productFamily: {
          set: [familyId],
        },
      },
    }),
  });
};
