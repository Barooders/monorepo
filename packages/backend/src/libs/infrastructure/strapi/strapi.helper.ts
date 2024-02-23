import envConfig from '@config/env/env.config';
import { PIMDynamicAttribute, PIMProductType } from '@libs/domain/types';
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
