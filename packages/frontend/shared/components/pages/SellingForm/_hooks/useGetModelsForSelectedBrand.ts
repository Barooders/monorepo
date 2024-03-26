import { fetchStrapi } from '@/clients/strapi';
import qs from 'qs';
import { useEffect, useState } from 'react';
import useSellForm from '../_state/useSellForm';
import { BrandsWithModelConfigType } from '../types';

const mapProductModels = (data: BrandsWithModelConfigType): string[] => {
  const productFamilyModels = data.data.flatMap((brand) =>
    brand.attributes.productFamilies.data.flatMap((family) =>
      family.attributes.productModels.data.map(
        (model) => model.attributes.name,
      ),
    ),
  );
  const productModels = data.data.flatMap((brand) =>
    brand.attributes.productModels.data.map((model) => model.attributes.name),
  );
  const allModels = [...productFamilyModels, ...productModels];
  return Array.from(new Set(allModels)).sort();
};

const fetchProductModels = async (brandName: string): Promise<string[]> => {
  const fetchProductModelsUrl = `/pim-brands?${qs.stringify({
    filters: {
      name: {
        $eq: brandName,
      },
    },
    fields: ['name'],
    populate: {
      productModels: {
        fields: 'name',
      },
      productFamilies: {
        fields: 'name',
        populate: {
          productModels: { fields: 'name' },
        },
      },
    },
    pagination: { limit: 1 },
  })}`;

  const data = await fetchStrapi<BrandsWithModelConfigType>(
    fetchProductModelsUrl,
  );
  return mapProductModels(data);
};

const useGetModelsForSelectedBrand = () => {
  const [models, setModels] = useState<string[]>([]);
  const { getSelectedBrand } = useSellForm();

  const selectedBrand = getSelectedBrand();

  useEffect(() => {
    if (selectedBrand) {
      fetchProductModels(selectedBrand.name).then((models) =>
        setModels(models),
      );
    }
  }, [selectedBrand]);

  return models;
};

export default useGetModelsForSelectedBrand;
