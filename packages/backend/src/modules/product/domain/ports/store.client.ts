import {
  ProductToStore,
  ProductToUpdate,
  StoredProduct,
  StoredVariant,
  Variant,
} from '@libs/domain/product.interface';
import { ImageToUpload, ProductImage } from '../types';

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
}
