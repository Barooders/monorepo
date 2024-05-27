import {
  ProductToStore,
  ProductToUpdate,
  StoredProduct,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';
import { Amount, URL, UUID } from '@libs/domain/value-objects';
import { ImageToUpload, ProductImage } from '../types';

export interface ProductCreationInput {
  title: string;
  description: string;
  vendor: string;
  productType: string;
  featuredImgSrc: URL;
  variants: { price: Amount }[];
}

export abstract class IStoreClient {
  abstract getProductDetails(productId: UUID): Promise<StoredProduct>;
  abstract createProduct(product: ProductToStore): Promise<
    Omit<StoredProduct, 'internalId' | 'variants'> & {
      variants: Omit<StoredVariant, 'internalId'>[];
    }
  >;
  abstract updateProduct(productId: UUID, data: ProductToUpdate): Promise<void>;
  abstract createProductVariant(
    productInternalId: UUID,
    data: Variant,
  ): Promise<Omit<StoredVariant, 'internalId'>>;
  abstract updateProductVariant(
    variantId: UUID,
    data: Partial<Variant>,
  ): Promise<void>;
  abstract deleteProductVariant(variantId: UUID): Promise<void>;
  abstract approveProduct(productId: UUID): Promise<void>;
  abstract rejectProduct(productId: UUID): Promise<void>;
  abstract addProductImage(
    productId: UUID,
    image: ImageToUpload,
  ): Promise<ProductImage>;
  abstract deleteProductImage(productId: UUID, imageId: string): Promise<void>;

  abstract createCommissionProduct(
    product: ProductCreationInput,
  ): Promise<{ id: string; variants: { id: string }[] }>;
  abstract cleanOldCommissions(): Promise<void>;
}
