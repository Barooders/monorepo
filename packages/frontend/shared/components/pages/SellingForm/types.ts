import { ProductStatus } from '@/types';

export type BrandType = { name: string };

export type FieldDefinitionType = BaseFieldType &
  (IntegerFieldType | BooleanFieldType | SelecFieldType | ColorFieldType);

export enum Condition {
  AS_NEW = 'AS_NEW',
  VERY_GOOD = 'VERY_GOOD',
  GOOD = 'GOOD',
}

export enum InformationsType {
  INTEGER = 'INTEGER',
  SELECT = 'SELECT',
  BOOLEAN = 'BOOLEAN',
  COLOR = 'COLOR',
}

export enum SellFormSteps {
  PRODUCT_INFOS = 'PRODUCT_INFOS',
  PICTURES = 'PICTURES',
  DESCRIPTION = 'DESCRIPTION',
  CONDITION_AND_PRICE = 'CONDITION_AND_PRICE',
  VENDOR = 'VENDOR',
}

type BaseFieldType = {
  tagPrefix: string;
  label: string;
  name: string;
  required: boolean;
};

type IntegerFieldType = {
  type: InformationsType.INTEGER;
  config: {
    max: number;
    min: number;
    unit: string;
    defaultValue: number;
  };
};

type BooleanFieldType = {
  type: InformationsType.BOOLEAN;
};

type SelecFieldType = {
  type: InformationsType.SELECT;
  config: { options: string[] };
};

type ColorFieldType = {
  type: InformationsType.COLOR;
  config: { options: { name: string; color: string }[] };
};

export type ProductTypeConfig = {
  name: string;
  fieldDefinitions: FieldDefinitionType[];
  brands: BrandType[];
};

export type TaxonomyItem = {
  name: string;
  id: string;
  children: string[];
  rootItem: boolean;
  order: number | null;
};

export type SellFormConfig = {
  allBrands: BrandType[];
  taxonomy: Record<string, TaxonomyItem>;
  productTypeConfig: Record<string, ProductTypeConfig>;
};

export type FormStepProps = { productInternalId: string };

export type FormStepType = {
  name: SellFormSteps;
  title: string;
  component: React.FC<FormStepProps>;
  hideValidateButton?: boolean;
};

export type ImageType = { src: string; id: number };

export type ProductInfoValueType =
  | boolean
  | number
  | string
  | string[]
  | ImageType[]
  | null;

export type BrandsConfigType = StrapiEntityList<{
  name: string;
}>;

export type BrandsWithModelConfigType = StrapiEntityList<{
  name: string;
  productModels: StrapiEntityList<{
    name: string;
  }>;
  productFamilies: StrapiEntityList<{
    name: string;
    productModels: StrapiEntityList<{
      name: string;
    }>;
  }>;
}>;

export type ProductTypeConfigType = StrapiEntityList<{
  name: string;
  order: null | number;
  required: null | boolean;
  brands: BrandsConfigType;
  productAttributes: StrapiEntityList<FieldDefinitionType>;
}>;

export type CategoriesConfigType = StrapiEntityList<{
  label: string;
  order: null | number;
  productTypes: StrapiEntityList<{
    name: string;
  }>;
}>;

export type UniversesConfigType = StrapiEntityList<{
  label: string;
  order: null | number;
  categories: StrapiEntityList<{
    label: string;
  }>;
}>;

export type StrapiEntity<T> = {
  id: number;
  attributes: T;
};

export type StrapiEntityList<T> = {
  data: StrapiEntity<T>[];
};

export type StrapiMedia = StrapiMediaFormat & {
  alternativeText: null;
  caption: null;
  formats: {
    small: StrapiMediaFormat;
    medium: StrapiMediaFormat;
    thumbnail: StrapiMediaFormat;
  };
  previewUrl: string | null;
  provider: 'aws-s3';
  provider_metadata: string | null;
  createdAt: string;
  updatedAt: string;
};

export type StrapiMediaFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
};

export type ProductToUpdate = {
  productInternalId: string;
  variantInternalId: string;
  condition: Condition;
  vendor: {
    id: string;
    phoneNumber: string | null;
  };
  status: ProductStatus;
  images: { src: string; id: number }[];
  description: string | null;
  productType: string;
  tags: string[];
  price: number | null;
  compareAtPrice: number | null;
  handDeliveryPostalCode: string | null;
};
