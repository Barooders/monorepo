import {
  ProductToStore,
  ProductToUpdate,
  StoredProduct,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';
import { Amount, URL } from '@libs/domain/value-objects';
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
  abstract getProductDetails(productId: string): Promise<StoredProduct>;
  abstract createProduct(product: ProductToStore): Promise<StoredProduct>;
  abstract updateProduct(
    productId: string,
    data: ProductToUpdate,
  ): Promise<void>;
  abstract publishProductInMobileChannel(productId: string): Promise<void>;
  abstract createProductVariant(
    productId: number,
    data: Variant,
  ): Promise<StoredVariant>;
  abstract updateProductVariant(
    variantId: string,
    data: Partial<Variant>,
  ): Promise<void>;
  abstract deleteProductVariant(
    productId: string,
    variantId: string,
  ): Promise<void>;
  abstract approveProduct(productId: string): Promise<void>;
  abstract rejectProduct(productId: string): Promise<void>;
  abstract addProductImage(
    productId: string,
    image: ImageToUpload,
  ): Promise<ProductImage>;
  abstract deleteProductImage(
    productId: string,
    imageId: string,
  ): Promise<void>;

  abstract createCommissionProduct(
    product: ProductCreationInput,
  ): Promise<{ id: string; variants: { id: string }[] }>;
  abstract publishCommissionProduct(productId: string): Promise<void>;
  abstract cleanOldCommissions(): Promise<void>;
}
