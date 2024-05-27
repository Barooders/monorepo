import { Condition, ProductStatus } from '@libs/domain/prisma.main.client';
import {
  Metafield,
  Product,
  ProductToUpdate,
  StoredMetafield,
  StoredProduct,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';

export type VariantToUpdate = Partial<
  Pick<
    StoredVariant,
    'price' | 'compare_at_price' | 'inventory_quantity' | 'condition'
  >
>;

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

export abstract class IStoreClient {
  abstract createProduct(data: Product): Promise<StoredProduct | null>;
  abstract createProductVariant(
    productInternalId: string,
    data: Variant,
  ): Promise<StoredVariant>;
  abstract updateProduct(
    productInternalId: string,
    data: ProductToUpdate,
  ): Promise<void>;
  abstract updateProductVariant(
    variantInternalId: string,
    data: VariantToUpdate,
  ): Promise<void>;
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
