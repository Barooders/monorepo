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

export abstract class IStoreClient {
  abstract createProduct(data: Product): Promise<StoredProduct | null>;
  abstract createProductVariant(
    product_id: number,
    data: Variant,
  ): Promise<StoredVariant>;
  abstract updateProduct(
    product_id: number,
    data: ProductToUpdate,
  ): Promise<void>;
  abstract updateProductVariant(
    variant_id: number,
    data: VariantToUpdate,
  ): Promise<void>;
  abstract deleteProductVariant(variantShopifyId: number): Promise<void>;
  abstract getProduct(product_id: number): Promise<StoredProduct | null>;
  abstract getVariantByTitle(
    product_id: number,
    variant: Variant,
  ): Promise<StoredVariant | null | undefined>;
  abstract getProductMetafields(productId: number): Promise<StoredMetafield[]>;
  abstract updateProductMetafieldValue(
    metafieldId: number,
    metafieldValue: Metafield['value'],
  ): Promise<StoredMetafield>;
}
