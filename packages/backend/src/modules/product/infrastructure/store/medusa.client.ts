import envConfig from '@config/env/env.config';
import { ProductStatus } from '@libs/domain/prisma.main.client';
import {
  Product,
  ProductToStore,
  Variant,
} from '@libs/domain/product.interface';
import { UUID } from '@libs/domain/value-objects';
import { createHttpClient } from '@libs/infrastructure/http/clients';
import {
  IStoreClient,
  ProductCreatedInStore,
  ProductCreationInput,
  ProductDetails,
  VariantCreatedInStore,
} from '@modules/product/domain/ports/store.client';
import { ImageToUpload, ProductImage } from '@modules/product/domain/types';
import { Injectable, Logger } from '@nestjs/common';
import { ImageUploadsClient } from './image-uploads-client';
import { CreateProductRequest, CreateProductResponse } from './medusa.dto';

export const medusaClient = createHttpClient(
  envConfig.externalServices.medusa.baseUrl,
  {
    headers: {
      'x-medusa-access-token': `${envConfig.externalServices.medusa.apiKey}`,
    },
  },
);

@Injectable()
export class MedusaClient implements IStoreClient {
  private readonly logger = new Logger(MedusaClient.name);

  constructor(private readonly imageUploadsClient: ImageUploadsClient) {}

  getProductDetails(productId: UUID): Promise<ProductDetails> {
    this.logger.log(`Getting product details for ${productId}`);
    throw new Error('Method not implemented.');
  }

  async createProduct(product: ProductToStore): Promise<ProductCreatedInStore> {
    this.logger.log(`Creating product ${product.title}`);

    const imagesUrl = product.images
      ?.filter((image) => image.src !== undefined)
      .map((image) => image.src as string);

    const uploadedImages =
      await this.imageUploadsClient.uploadImages(imagesUrl);

    const requestBody: CreateProductRequest = {
      title: product.title,
      description: product.body_html,
      status: product.status === ProductStatus.ACTIVE ? 'published' : 'draft',
      images: uploadedImages,
    };

    const { product: createdProduct } =
      await medusaClient<CreateProductResponse>('/admin/products', {
        method: 'POST',
        data: requestBody,
      });

    throw new Error('Product created in Medusa with id ' + createdProduct.id);
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
