import { fetchStrapi } from '@/clients/strapi';
import useAsyncFn from '@/hooks/useWrappedAsyncFn';
import keyBy from 'lodash/keyBy';
import uniqBy from 'lodash/uniqBy';
import qs from 'qs';
import useSellForm from '../_state/useSellForm';
import {
  BrandsConfigType,
  CategoriesConfigType,
  ProductTypeConfigType,
  SellFormConfig,
  TaxonomyItem,
  UniversesConfigType,
} from '../types';

const mapBrands = (brands: BrandsConfigType) =>
  brands.data.map(({ attributes: { name } }) => ({
    name,
  }));

const mapSellFormConfig = (
  productTypeConfig: ProductTypeConfigType,
  categoriesConfig: CategoriesConfigType,
  universesConfig: UniversesConfigType,
): SellFormConfig => {
  const taxonomy: TaxonomyItem[] = [
    ...productTypeConfig.data.map(({ id, attributes: { name, order } }) => ({
      name,
      id: id.toString(),
      children: [],
      rootItem: false,
      order,
    })),
    ...categoriesConfig.data.map(
      ({ id, attributes: { label, productTypes, order } }) => ({
        name: label,
        id: id.toString(),
        children: productTypes.data.map(({ id }) => id.toString()),
        rootItem: false,
        order,
      }),
    ),
    ...universesConfig.data.map(
      ({ id, attributes: { label, categories, order } }) => ({
        name: label,
        id: id.toString(),
        children: categories.data.map(({ id }) => id.toString()),
        rootItem: true,
        order,
      }),
    ),
  ];

  const allBrands = uniqBy(
    productTypeConfig.data.flatMap(({ attributes: { brands } }) =>
      mapBrands(brands),
    ),
    'name',
  );

  return {
    taxonomy: keyBy(taxonomy, 'id'),
    allBrands,
    productTypeConfig: keyBy(
      productTypeConfig.data.map(({ attributes }) => ({
        name: attributes.name,
        required: !!attributes.required,
        brands: mapBrands(attributes.brands),
        fieldDefinitions: attributes.productAttributes.data.map(
          ({ attributes: productAttributes }) => productAttributes,
        ),
      })),
      'name',
    ),
  };
};

const fetchSellFormInformation = async (): Promise<SellFormConfig> => {
  const fetchProductTypeUrl = `/pim-product-types?${qs.stringify({
    fields: ['name', 'order'],
    populate: {
      productAttributes: '*',
      brands: {
        fields: ['name'],
      },
    },
    pagination: { limit: 500 },
  })}`;
  const fetchCategoriesUrl = `/pim-categories?${qs.stringify({
    fields: ['label', 'order'],
    populate: { productTypes: { fields: 'name' } },
    pagination: { limit: 200 },
  })}`;
  const fetchUniversesUrl = `/pim-universes?${qs.stringify({
    fields: ['label', 'order'],
    populate: { categories: { fields: 'label' } },
    pagination: { limit: 200 },
  })}`;

  const [productTypes, categories, universes] = await Promise.all([
    fetchStrapi<ProductTypeConfigType>(fetchProductTypeUrl),
    fetchStrapi<CategoriesConfigType>(fetchCategoriesUrl),
    fetchStrapi<UniversesConfigType>(fetchUniversesUrl),
  ]);

  return mapSellFormConfig(productTypes, categories, universes);
};

const useFetchSellFormInformation = () => {
  const setSellFormConfig = useSellForm((state) => state.setSellFormConfig);

  return useAsyncFn(async () => {
    const sellFormConfig = await fetchSellFormInformation();
    setSellFormConfig(sellFormConfig);
  });
};

export default useFetchSellFormInformation;
