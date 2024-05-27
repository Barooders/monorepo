import {
  Condition,
  ProductStatus,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';

export interface EntityId {
  id: string;
  storeId: string;
}

export enum ShopifyProductStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DRAFT = 'draft',
}

export const mapCondition = (
  condition: string | null | undefined,
): Condition => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!condition) return Condition.GOOD;

  if (condition.toLowerCase().includes('neuf')) return Condition.AS_NEW;
  if (condition.toLowerCase().includes('as_new')) return Condition.AS_NEW;

  if (condition.toLowerCase().includes('très')) return Condition.VERY_GOOD;
  if (condition.toLowerCase().includes('very_good')) return Condition.VERY_GOOD;

  return Condition.GOOD;
};

export const mapProductStatus = (
  status: ShopifyProductStatus,
): ProductStatus => {
  switch (status) {
    case ShopifyProductStatus.ACTIVE:
      return ProductStatus.ACTIVE;
    case ShopifyProductStatus.ARCHIVED:
      return ProductStatus.ARCHIVED;
    case ShopifyProductStatus.DRAFT:
      return ProductStatus.DRAFT;
    default:
      throw new Error(`Unknown shopify status: ${status}`);
  }
};

interface ProductBase {
  title: string;
  body_html: string;
  product_type: string;
  images: Image[];
  price?: number;
  compare_at_price?: number;
  EANCode?: string;
  GTINCode?: string;
  source?: string;
  sourceUrl?: string;
  salesChannels?: SalesChannelName[];
}

export interface FullProduct extends ProductBase {
  variants: Variant[];
  tags: string[];
}

export interface Product extends FullProduct {
  metafields: Metafield[];
  status: ProductStatus;
  handDeliveryPostalCode?: string | null;
  bundlePrices?: { minQuantity: number; unitPriceInCents: number }[];
}

export interface ProductToStore extends Product {
  vendorId: string;
  published: boolean;
}

export type ProductToUpdate = Partial<
  Omit<Product, 'variants'> & { vendorId: string }
>;

export interface StoredProduct extends ProductBase {
  internalId: string;
  status: ProductStatus;
  vendor: string;
  tags: string[];
  variants: StoredVariant[];
  options: Option[];
  created_at: string;
  updated_at: string;
  template_suffix?: string;
  handle: string;
  published_at?: string;
  published_scope?: string;
  image: {
    src: string;
    shopifyId: number;
  };
  images: {
    src: string;
    shopifyId: number;
  }[];
}

export type StoreProductWithoutCondition = Omit<
  StoredProduct,
  'variants' | 'internalId'
> & {
  variants: Omit<StoredVariant, 'condition' | 'internalId'>[];
};

export interface Metafield {
  key: string;
  value: string | number;
  namespace: string;
  type?: string;
}

export interface StoredMetafield extends Metafield {
  id: number;
}

interface VariantBase {
  title?: string;
  price?: string;
  compare_at_price?: string | null;
  sku?: string;
  inventory_quantity?: number;
  metafields?: Metafield[];
  condition: Condition;
}

export interface Variant extends VariantBase {
  internal_id?: string; // This is the id of the StoredVariant in our database
  external_id: string;
  optionProperties: { key: string; value: string }[];
}

export interface StoredVariant extends VariantBase {
  internalId: string;
  option1?: string;
  option2?: string;
  option3?: string;
}

export interface Option {
  name: string;
  values: string[];
}

export interface Image {
  src?: string;
  attachment?: string;
  id?: number;
}

export const getVariantsOptions = (
  variants: Variant[],
): { name: string; values: string[] }[] => {
  return variants.reduce(
    (acc: { name: string; values: string[] }[], variant) => {
      variant.optionProperties.forEach((optionProperty) => {
        const { key, value } = optionProperty;

        // Find the index of the option in the accumulator
        const index = acc.findIndex((option) => option.name === key);

        // If the option already exists, add the value to its values array
        if (index !== -1) {
          acc[index].values.push(value);
        } else {
          // Create a new option entry with an array containing the value
          acc.push({
            name: key,
            values: [value],
          });
        }
      });

      return acc;
    },
    [],
  );
};
