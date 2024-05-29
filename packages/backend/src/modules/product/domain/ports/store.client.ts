import { Condition, ProductStatus } from '@libs/domain/prisma.main.client';
import {
  ProductToStore,
  ProductToUpdate,
  Variant,
} from '@libs/domain/product.interface';
import { Amount, URL, UUID } from '@libs/domain/value-objects';
import { ImageToUpload, ProductImage } from '../types';
import { ImageStoreId } from '../value-objects/image-store-id.value-object';
import { ProductStoreId } from '../value-objects/product-store-id.value-object';
import { VariantStoreId } from '../value-objects/variant-store-id.value-object';

export interface ProductCreationInput {
  title: string;
  description: string;
  vendor: string;
  productType: string;
  featuredImgSrc: URL;
  variants: { price: Amount }[];
}

export type ProductDetails = {
  body_html: string;
  status: ProductStatus;
  product_type: string;
  tags: string[];
  vendor: string;
  variants: {
    internalId: string;
    price: string;
    compare_at_price?: string;
    condition: Condition;
  }[];
  images: {
    src: string;
    storeId: ImageStoreId;
  }[];
};

export type ProductCreatedInStore = {
  storeId: ProductStoreId;
  handle: string;
  title: string;
  images: { src: string }[];
  variants: VariantCreatedInStore[];
};

export type VariantCreatedInStore = {
  storeId: VariantStoreId;
};

export abstract class IStoreClient {
  abstract getProductDetails(productId: UUID): Promise<ProductDetails>;
  abstract createProduct(
    product: ProductToStore,
  ): Promise<ProductCreatedInStore>;
  abstract updateProduct(productId: UUID, data: ProductToUpdate): Promise<void>;
  abstract createProductVariant(
    productInternalId: UUID,
    data: Variant,
  ): Promise<VariantCreatedInStore>;
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
