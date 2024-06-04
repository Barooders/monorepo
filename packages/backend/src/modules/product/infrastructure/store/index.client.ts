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
import { StoreId } from '@modules/product/domain/value-objects/store-id.value-object';
import { VariantStoreId } from '@modules/product/domain/value-objects/variant-store-id.value-object';
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
    const [shopifyResponse, medusaResponse] = await this.makeCallsOnExisting<
      [UUID, ImageToUpload],
      ProductImage
    >(productId, 'addProductImage', productId, image);

    return {
      src: medusaResponse?.src ?? shopifyResponse?.src ?? '',
      storeId: new StoreId({
        medusaId: medusaResponse?.storeId.value,
        shopifyId: parseInt(shopifyResponse?.storeId.value ?? ''),
      }),
    };
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
  ): Promise<VariantStoreId> {
    const [medusaVariant, shopifyVariant] = await Promise.all([
      this.medusaClient.createCommissionProduct(product),
      this.shopifyClient.createCommissionProduct(product),
    ]);

    const shopifyId = shopifyVariant.shopifyIdIfExists;
    const medusaId = medusaVariant.medusaIdIfExists;

    if (shopifyId === undefined || medusaId === undefined)
      throw new Error('Commission was not created in both stores');

    return new VariantStoreId({
      shopifyId,
      medusaId,
    });
  }

  async createProduct(product: ProductToStore): Promise<ProductCreatedInStore> {
    const [medusaProduct, shopifyProduct] = await Promise.all([
      this.medusaClient.createProduct(product),
      this.shopifyClient.createProduct(product),
    ]);

    return {
      handle: medusaProduct.handle,
      images: medusaProduct.images,
      storeId: new StoreId({
        medusaId: medusaProduct.storeId.value,
        shopifyId: parseInt(shopifyProduct.storeId.value),
      }),
      title: medusaProduct.title,
      variants: medusaProduct.variants,
    };
  }

  async createProductVariant(
    productInternalId: UUID,
    data: Variant,
  ): Promise<VariantCreatedInStore> {
    const [shopifyResponse, medusaResponse] = await this.makeCallsOnExisting<
      [UUID, Variant],
      VariantCreatedInStore
    >(productInternalId, 'createProductVariant', productInternalId, data);

    return {
      storeId: new StoreId({
        medusaId: medusaResponse?.storeId.value,
        shopifyId: parseInt(shopifyResponse?.storeId.value ?? ''),
      }),
    };
  }

  async deleteProductImage(
    productId: UUID,
    imageId: ImageStoreId,
  ): Promise<void> {
    await this.makeCallsOnExisting<[UUID, ImageStoreId], void>(
      productId,
      'deleteProductImage',
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
    const [shopifyResponse, medusaResponse] = await this.makeCallsOnExisting<
      [UUID],
      ProductDetails
    >(productId, 'getProductDetails', productId);

    if (medusaResponse !== null) {
      return medusaResponse;
    }
    if (shopifyResponse !== null) {
      return shopifyResponse;
    }

    throw new Error('No results');
  }

  async rejectProduct(productId: UUID): Promise<void> {
    await this.makeCallsOnExisting<[UUID], void>(
      productId,
      'rejectProduct',
      productId,
    );
  }

  async updateProduct(productId: UUID, data: VariantUpdates): Promise<void> {
    await this.makeCallsOnExisting<[UUID, VariantUpdates], void>(
      productId,
      'updateProduct',
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
  ) {
    const { medusaId, shopifyId } = await this.prisma.product.findUniqueOrThrow(
      {
        where: { id: productId.uuid },
        select: { medusaId: true, shopifyId: true },
      },
    );

    const storeCalls = [
      shopifyId !== null
        ? // @ts-expect-error no index signature
          this.shopifyClient[methodName](...args)
        : Promise.resolve(null),
      medusaId !== null
        ? // @ts-expect-error no index signature
          this.medusaClient[methodName](...args)
        : Promise.resolve(null),
    ];

    return (await Promise.all(storeCalls)) as [
      ReturnType | null,
      ReturnType | null,
    ];
  }
}
