import { PrismaMainClient } from '@libs/domain/prisma.main.client';
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
import { ImageStoreId } from '@modules/product/domain/value-objects/image-store-id.value-object';
import { Injectable } from '@nestjs/common';
import { MedusaClient } from './medusa.client';
import { ShopifyClient } from './shopify.client';

type VariantUpdates = Partial<Omit<Product, 'variants'> & { vendorId: string }>;

@Injectable()
export class StoreClient implements IStoreClient {
  constructor(
    private prisma: PrismaMainClient,
    private medusaClient: MedusaClient,
    private shopifyClient: ShopifyClient,
  ) {}

  async addProductImage(
    productId: UUID,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    return await this.makeCallsOnExisting<[UUID, ImageToUpload], ProductImage>(
      productId,
      'addProductImage',
      productId,
      image,
    );
  }
  async approveProduct(productId: UUID): Promise<void> {
    await this.makeCallsOnExisting<[UUID], ProductImage>(
      productId,
      'approveProduct',
      productId,
    );
  }

  async cleanOldCommissions(): Promise<void> {
    await Promise.all([
      this.medusaClient.cleanOldCommissions(),
      this.shopifyClient.cleanOldCommissions(),
    ]);
  }

  async createCommissionProduct(
    product: ProductCreationInput,
  ): Promise<{ id: string; variants: { id: string }[] }> {
    const [medusaProduct] = await Promise.all([
      this.medusaClient.createCommissionProduct(product),
      this.shopifyClient.createCommissionProduct(product),
    ]);

    return medusaProduct;
  }

  async createProduct(product: ProductToStore): Promise<ProductCreatedInStore> {
    const [medusaProduct] = await Promise.all([
      this.medusaClient.createProduct(product),
      this.shopifyClient.createProduct(product),
    ]);

    return medusaProduct;
  }

  async createProductVariant(
    productInternalId: UUID,
    data: Variant,
  ): Promise<VariantCreatedInStore> {
    return await this.makeCallsOnExisting<
      [UUID, Variant],
      VariantCreatedInStore
    >(productInternalId, 'createProductVariant', productInternalId, data);
  }

  async deleteProductImage(
    productId: UUID,
    imageId: ImageStoreId,
  ): Promise<void> {
    return await this.makeCallsOnExisting<[UUID, ImageStoreId], void>(
      productId,
      'createProductVariant',
      productId,
      imageId,
    );
  }

  async deleteProductVariant(variantId: UUID): Promise<void> {
    const { productId } = await this.prisma.productVariant.findUniqueOrThrow({
      where: { id: variantId.uuid },
      select: { productId: true },
    });
    await this.makeCallsOnExisting<[UUID], void>(
      new UUID({ uuid: productId }),
      'deleteProductVariant',
      variantId,
    );
  }

  async getProductDetails(productId: UUID): Promise<ProductDetails> {
    return await this.makeCallsOnExisting<[UUID], ProductDetails>(
      productId,
      'getProductDetails',
      productId,
    );
  }

  async rejectProduct(productId: UUID): Promise<void> {
    return await this.makeCallsOnExisting<[UUID], void>(
      productId,
      'rejectProduct',
      productId,
    );
  }

  async updateProduct(productId: UUID, data: VariantUpdates): Promise<void> {
    await this.makeCallsOnExisting<[UUID, VariantUpdates], void>(
      productId,
      'rejectProduct',
      productId,
      data,
    );
  }

  async updateProductVariant(
    variantId: UUID,
    data: Partial<Variant>,
  ): Promise<void> {
    const { productId } = await this.prisma.productVariant.findUniqueOrThrow({
      where: { id: variantId.uuid },
      select: { productId: true },
    });
    await this.makeCallsOnExisting<[UUID, Partial<Variant>], void>(
      new UUID({ uuid: productId }),
      'updateProductVariant',
      variantId,
      data,
    );
  }

  private async makeCallsOnExisting<ArgsType extends any[], ReturnType>(
    productId: UUID,
    methodName: string,
    ...args: ArgsType
  ): Promise<ReturnType> {
    const { medusaId, shopifyId } = await this.prisma.product.findUniqueOrThrow(
      {
        where: { id: productId.uuid },
        select: { medusaId: true, shopifyId: true },
      },
    );

    const storeCalls = [];

    if (shopifyId !== null) {
      // @ts-expect-error no index signature
      storeCalls.push(this.shopifyClient[methodName](...args));
    }
    if (medusaId !== null) {
      // @ts-expect-error no index signature
      storeCalls.push(this.medusaClient[methodName](...args));
    }

    const [firstResponse] = await Promise.all(storeCalls);

    return firstResponse as ReturnType;
  }
}
