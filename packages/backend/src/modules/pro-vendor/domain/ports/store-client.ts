import { Condition, ProductStatus } from '@libs/domain/prisma.main.client';
import {
  Metafield,
  Product,
  ProductToUpdate,
  StoredMetafield,
  Variant,
} from '@libs/domain/product.interface';
import { VariantToUpdate } from './types';

export type VariantFromStore = {
  internalId: string;
  price: string;
  compare_at_price: string | null;
  inventory_quantity: number;
  condition: Condition;
};

export type ProductFromStore = {
  internalId: string;
  title: string;
  body_html: string;
  product_type: string;
  status: ProductStatus;
  vendor: string;
  tags: string[];
  EANCode?: string;
  GTINCode?: string;
  source?: string;
  images: {
    src: string;
    shopifyId: number;
  }[];
  variants: VariantFromStore[];
};

export type CreatedProductForSync = {
  internalId: string;
  variants: {
    internalId: string;
  }[];
};

export abstract class IStoreClient {
  abstract createProduct(data: Product): Promise<CreatedProductForSync | null>;
  abstract createProductVariant(
    productInternalId: string,
    data: Variant,
  ): Promise<string>;
  abstract updateProduct(
    productInternalId: string,
    data: ProductToUpdate,
  ): Promise<void>;
  abstract updateProductVariant(data: VariantToUpdate): Promise<void>;
  abstract deleteProductVariant(variantInternalId: string): Promise<void>;
  abstract getProduct(
    productInternalId: string,
  ): Promise<ProductFromStore | null>;
  abstract getVariantByTitle(
    productInternalId: string,
    variant: Variant,
  ): Promise<string | null>;
  abstract getProductMetafields(
    productInternalId: string,
  ): Promise<StoredMetafield[]>;
  abstract updateProductMetafieldValue(
    metafieldId: number,
    metafieldValue: Metafield['value'],
  ): Promise<StoredMetafield>;
}
