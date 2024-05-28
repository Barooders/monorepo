import {
  Product,
  ProductToStore,
  Variant,
} from '@libs/domain/product.interface';
import { UUID } from '@libs/domain/value-objects';
import {
  IStoreClient,
  ProductCreatedInStore,
  ProductCreationInput,
  ProductDetails,
  VariantCreatedInStore,
} from '@modules/product/domain/ports/store.client';
import { ImageToUpload, ProductImage } from '@modules/product/domain/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MedusaClient implements IStoreClient {
  private readonly logger = new Logger(MedusaClient.name);

  getProductDetails(productId: UUID): Promise<ProductDetails> {
    this.logger.log(`Getting product details for ${productId}`);
    throw new Error('Method not implemented.');
  }

  createProduct(product: ProductToStore): Promise<ProductCreatedInStore> {
    this.logger.log(`Creating product ${product.title}`);

    throw new Error('Method not implemented.');
  }

  updateProduct(
    productId: UUID,
    data: Partial<Omit<Product, 'variants'> & { vendorId: string }>,
  ): Promise<void> {
    this.logger.log(`Updating product ${productId}`, data);

    throw new Error('Method not implemented.');
  }

  createProductVariant(
    productInternalId: UUID,
    data: Variant,
  ): Promise<VariantCreatedInStore> {
    this.logger.log(`Creating variant for product ${productInternalId}`, data);

    throw new Error('Method not implemented.');
  }

  updateProductVariant(variantId: UUID, data: Partial<Variant>): Promise<void> {
    this.logger.log(`Updating variant ${variantId}`, data);

    throw new Error('Method not implemented.');
  }

  deleteProductVariant(variantId: UUID): Promise<void> {
    this.logger.log(`Deleting variant ${variantId}`);

    throw new Error('Method not implemented.');
  }

  approveProduct(productId: UUID): Promise<void> {
    this.logger.log(`Approving product ${productId}`);

    throw new Error('Method not implemented.');
  }

  rejectProduct(productId: UUID): Promise<void> {
    this.logger.log(`Rejecting product ${productId}`);

    throw new Error('Method not implemented.');
  }

  addProductImage(
    productId: UUID,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    this.logger.log(`Adding image to product ${productId}`, image);

    throw new Error('Method not implemented.');
  }

  deleteProductImage(productId: UUID, imageId: string): Promise<void> {
    this.logger.log(`Deleting image ${imageId} from product ${productId}`);

    throw new Error('Method not implemented.');
  }

  createCommissionProduct(
    product: ProductCreationInput,
  ): Promise<{ id: string; variants: { id: string }[] }> {
    this.logger.log(`Creating commission product ${product.title}`);

    throw new Error('Method not implemented.');
  }

  cleanOldCommissions(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
