import { CategoryType, FieldDefinition } from "../types";

type NameToID = { [name: string]: string };

export const createEntity = (entityName: string, data: Record<string, unknown>) =>
  strapi.entityService.create(entityName, {
    fields: ["id"],
    data: {
      ...data,
      publishedAt: new Date(),
    },
  });

export const createBrands = async (brandNames: string[]): Promise<NameToID> => {
  const result: NameToID = {};
  await Promise.all(
    brandNames.map(async (brandName: string) => {
      const { id } = await createEntity("api::pim-brand.pim-brand", { name: brandName });
      result[brandName] = id;
    })
  );

  return result;
};

const extractConfig = (field: FieldDefinition) => {
  switch (field.type) {
    case "Select":
      return { options: field.options };
    case "Integer":
      return { min: field.min, max: field.max, defaultValue: field.defaultValue, unit: field.unit };
    case "Color":
      return { options: field.options };
    case "Boolean":
      return {};
    default:
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      throw new Error(`Unkown type ${field.type}`);
  }
};

export const createProductAttributes = async (fields: { [name: string]: FieldDefinition }): Promise<NameToID> => {
  const result: NameToID = {};
  await Promise.all(
    Object.keys(fields).map(async (fieldName: string) => {
      const field = fields[fieldName];
      const { id } = await createEntity("api::pim-product-attribute.pim-product-attribute", {
        name: fieldName,
        tagPrefix: field.tagPrefix,
        label: field.label,
        type: field.type.toUpperCase(),
        config: extractConfig(field),
        required: field?.required,
      });
      result[fieldName] = id;
    })
  );

  return result;
};

export const createUniverses = async (universes: string[]): Promise<NameToID> => {
  const result: NameToID = {};
  await Promise.all(
    universes.map(async universe => {
      const { id } = await createEntity("api::pim-universe.pim-universe", {
        name: universe,
        label: universe,
      });
      result[universe] = id;
    })
  );

  return result;
};

export const formatCategoryName = (name: string, universe: string): string => `${universe} > ${name}`;

export const createCategories = async (
  categories: { name: string; universeName: string }[],
  universeNameToId: NameToID
): Promise<NameToID> => {
  const result: NameToID = {};
  await Promise.all(
    categories.map(async ({ name, universeName }) => {
      const categoryName = formatCategoryName(name, universeName);
      const { id } = await createEntity("api::pim-category.pim-category", {
        name: categoryName,
        label: name,
        universe: universeNameToId[universeName],
      });
      result[categoryName] = id;
    })
  );

  return result;
};

export const createProductTypes = async (
  productTypes: (CategoryType & { categories: string[] })[],
  categoryNameToId: NameToID,
  attributeNameToId: NameToID,
  brandNametoId: NameToID
): Promise<NameToID> => {
  const result: NameToID = {};
  await Promise.all(
    productTypes.map(async ({ name, brands, fields, categories }) => {
      const { id } = await createEntity("api::pim-product-type.pim-product-type", {
        name,
        categories: categories.map(category => categoryNameToId[category]),
        productAttributes: fields.map(field => attributeNameToId[field]),
        brands: brands.map(brand => brandNametoId[brand]),
      });
      result[name] = id;
    })
  );

  return result;
};
