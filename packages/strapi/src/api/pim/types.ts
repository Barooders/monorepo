export type Domain = {
  name: string;
  categories: [
    {
      name: string;
      types: CategoryType[];
    }
  ];
};

export type CategoryType = {
  name: string;
  fields: string[];
  brands: string[];
};

export type FieldDefinition =
  | FieldSelectDefinition
  | FieldBooleadDefinition
  | FieldIntegerDefinition
  | FiedlDefinitionColor;

export type FieldSelectDefinition = {
  type: "Select";
  tagPrefix: string;
  label: string;
  options: string[];
  required?: boolean;
};

export type FieldBooleadDefinition = { type: "Boolean"; tagPrefix: string; label: string; required?: boolean };

export type FieldIntegerDefinition = {
  type: "Integer";
  tagPrefix: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  unit: string;
  required?: boolean;
};

export type FiedlDefinitionColor = {
  type: "Color";
  tagPrefix: string;
  label: string;
  options: { name: string; color: string }[];
  required?: boolean;
};

export type Brand = {
  name: string;
  models: string[];
};

export type SellingFormType = {
  domains: Domain[];
  fieldDefinitions: {
    [name: string]: FieldDefinition;
  };
  brands: {
    [name: string]: Brand;
  };
};

export type SellingProfile = {
  "Product Type": string;
  Weight: number;
};

export type Breadcrumbs = {
  productType: string;
  typeCollectionId: string;
  sport: string;
  sportCollectionId: string;
  gendered: boolean;
  "productType+femme": string;
  "productType+homme": string;
  "productType+enfant": string;
};
