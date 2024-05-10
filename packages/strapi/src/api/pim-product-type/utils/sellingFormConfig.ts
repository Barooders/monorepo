import capitalize from 'lodash/capitalize';
import keyBy from 'lodash/keyBy';
import sortBy from 'lodash/sortBy';

const sortByOrderAndName = (collection: any) =>
  sortBy(sortBy(collection, 'name'), 'order');

export const extractEntity = (
  entityName: string,
  config: Record<string, unknown> = {},
) => strapi.entityService.findMany(entityName, config);

export const extractBrands = async (): Promise<Record<string, unknown>> => {
  const brands = await extractEntity('api::pim-brand.pim-brand', {
    publicationState: 'live',
    populate: { productModels: true },
  });
  const pimBrands = brands.map((brand) => ({
    name: brand.name,
    models: [...brand.productModels.map(({ name }) => name)].sort(),
  }));

  return keyBy(pimBrands, 'name');
};

export const extractFieldDefinitions = async () => {
  const productAttributes = await extractEntity(
    'api::pim-product-attribute.pim-product-attribute',
    {
      publicationState: 'live',
    },
  );

  return productAttributes.reduce(
    (fieldDefinitions, productAttribute) => ({
      ...fieldDefinitions,
      [productAttribute.name]: {
        tagPrefix: productAttribute.tagPrefix,
        label: productAttribute.label,
        type: capitalize(productAttribute.type),
        ...(productAttribute.required
          ? { required: productAttribute.required }
          : {}),
        ...productAttribute.config,
      },
    }),
    {},
  );
};

export const extractDomains = async () => {
  const universes = await extractEntity('api::pim-universe.pim-universe', {
    publicationState: 'live',
    populate: {
      categories: {
        populate: {
          productTypes: {
            populate: {
              productAttributes: true,
              brands: true,
            },
          },
        },
      },
    },
  });

  return sortByOrderAndName(universes).map((universe) => {
    return {
      name: universe.name,
      categories: sortByOrderAndName(universe.categories).map((category) => {
        return {
          name: category.label,
          types: sortByOrderAndName(category.productTypes).map(
            (productType) => {
              return {
                name: productType.name,
                fields: [
                  ...productType.productAttributes.map(({ name }) => name),
                ].sort(),
                brands: [...productType.brands.map(({ name }) => name)].sort(),
              };
            },
          ),
        };
      }),
    };
  });
};
