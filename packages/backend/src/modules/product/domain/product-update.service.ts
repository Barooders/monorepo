import {
  AggregateName,
  Condition,
  EventName,
  Prisma,
  PrismaMainClient,
  ProductNotation,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import {
  EntityId,
  ProductToUpdate,
  Variant,
} from '@libs/domain/product.interface';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { toCents } from '@libs/helpers/currency';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import { pick } from 'lodash';
import { NotificationService } from './notification.service';
import { UserNotAllowedException } from './ports/exceptions';
import { IPIMClient } from './ports/pim.client';
import { IQueueClient } from './ports/queue-client';
import { IStoreClient } from './ports/store.client';
import { getHandDeliveryMetafields } from './product.methods';
import { ImageToUpload, ProductImage } from './types';

export enum ModerationAction {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
}

type UpdateProductOptions = {
  notifyVendor: boolean;
};

@Injectable()
export class ProductUpdateService {
  private readonly logger = new Logger(ProductUpdateService.name);

  constructor(
    private pimClient: IPIMClient,
    private storeClient: IStoreClient,
    private prisma: PrismaMainClient,
    private notificationService: NotificationService,
    private queueClient: IQueueClient,
  ) {}

  async updateProduct(
    productId: EntityId,
    data: ProductToUpdate,
    { notifyVendor }: UpdateProductOptions,
    author: Author,
  ): Promise<void> {
    const updates = {
      ...data,
      ...(data.images?.length === 0 && { status: ProductStatus.DRAFT }),
      metafields: [
        ...(data.metafields ?? []),
        ...(data.handDeliveryPostalCode
          ? getHandDeliveryMetafields(true, data.handDeliveryPostalCode)
          : []),
      ],
    };

    if (data.product_type)
      await this.pimClient.checkIfProductTypeExists(data.product_type);

    await this.storeClient.updateProduct(productId.storeId, updates);
    const updatesAndPreviousValues = await this.updateProductInDatabase(
      productId,
      updates,
    );

    try {
      const vendor = await this.getVendorFromProductId(productId);
      await this.notifyEvent({
        eventName: EventName.PRODUCT_UPDATED,
        vendorId: vendor.authUserId,
        productId,
        payload: {
          productShopifyId: productId.storeId,
          updates: jsonStringify(updatesAndPreviousValues),
        },
        metadata: {
          author,
        },
      });

      if (notifyVendor) {
        await this.notificationService.notify(
          vendor.user.email,
          vendor.firstName,
        );
      }
    } catch (e: any) {
      this.logger.error(
        `Unable to create event PRODUCT_UPDATED when updating product ${productId.id} : ${e.message}`,
        e,
      );
    }
  }

  async addProductImage(
    productId: string,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    return this.storeClient.addProductImage(productId, image);
  }

  async deleteProductImage(productId: string, imageId: string): Promise<void> {
    return this.storeClient.deleteProductImage(productId, imageId);
  }

  async updateProductByUser(
    productId: EntityId,
    productToUpdate: ProductToUpdate,
    userId: EntityId,
  ): Promise<void> {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productId.id,
      },
    });

    if (product.vendorId !== String(userId.id)) {
      throw new UserNotAllowedException(productId.id, userId.id, 'update');
    }

    await this.updateProduct(
      productId,
      productToUpdate,
      {
        notifyVendor:
          product.status !== ProductStatus.ACTIVE &&
          productToUpdate.status === ProductStatus.ACTIVE,
      },
      {
        type: 'user',
        id: userId.id,
      },
    );
  }

  async updateProductVariant(
    productId: EntityId,
    variantId: EntityId,
    data: Partial<Variant>,
    author: Author,
  ) {
    await this.storeClient.updateProductVariant(variantId.storeId, data);
    const updatesAndPreviousValues = await this.updateVariantInDatabase(
      variantId,
      data,
    );

    try {
      const vendor = await this.getVendorFromProductId(productId);
      await this.notifyEvent({
        eventName: EventName.PRODUCT_UPDATED,
        vendorId: vendor.authUserId,
        productId,
        payload: {
          variantId: variantId.id,
          productStoreId: productId.storeId,
          variantStoreId: variantId.storeId,
          updates: jsonStringify(updatesAndPreviousValues),
        },
        metadata: {
          author,
        },
      });
    } catch (e: any) {
      this.logger.error(
        `Unable to create event PRODUCT_UPDATED when updating variant ${variantId.id} : ${e.message}`,
        e,
      );
    }
  }

  async deleteProductVariant(
    productId: EntityId,
    variantId: EntityId,
    author: Author,
  ): Promise<void> {
    await this.storeClient.deleteProductVariant(
      productId.storeId,
      variantId.storeId,
    );
    const productVariantInDB = await this.prisma.productVariant.delete({
      where: {
        id: variantId.id,
      },
      include: {
        product: true,
      },
    });
    await this.notifyEvent({
      eventName: EventName.PRODUCT_UPDATED,
      vendorId: productVariantInDB.product.vendorId,
      productId,
      payload: {
        variantId: variantId.id,
        productStoreId: productId.storeId,
        variantStoreId: variantId.storeId,
      },
      metadata: {
        comment: 'Product variant deleted',
        author,
      },
    });
  }

  async applyStockUpdateInDatabaseOnly(
    productVariantId: string,
    stockUpdate: number,
    author: Author,
  ): Promise<void> {
    const productVariantInDB = await this.prisma.productVariant.update({
      where: {
        id: productVariantId,
      },
      data: {
        quantity: {
          increment: stockUpdate,
        },
      },
      include: { product: true },
    });

    await this.notifyEvent({
      eventName: EventName.PRODUCT_UPDATED,
      vendorId: productVariantInDB.product.vendorId,
      productId: {
        id: productVariantInDB.productId,
        storeId: productVariantInDB.product.shopifyId.toString(),
      },
      payload: {
        variantId: productVariantInDB.id,
        stockUpdate,
        newQuantity: productVariantInDB.quantity,
      },
      metadata: {
        author,
      },
    });
  }

  async moderateProduct(
    productId: EntityId,
    action: ModerationAction,
    author: Author,
  ): Promise<void> {
    switch (action) {
      case ModerationAction.APPROVE:
        await this.storeClient.approveProduct(productId.storeId);
        break;
      case ModerationAction.REJECT:
        await this.rejectProduct(productId, author);
        break;
      default:
        throw new Error(`Action ${action} is not supported`);
    }
  }

  private async rejectProduct(
    productId: EntityId,
    author: Author,
  ): Promise<void> {
    await this.updateProduct(
      productId,
      { status: ProductStatus.DRAFT },
      { notifyVendor: false },
      author,
    );
    await this.storeClient.rejectProduct(productId.storeId);

    try {
      const vendor = await this.getVendorFromProductId(productId);
      await this.notifyEvent({
        eventName: EventName.PRODUCT_REFUSED,
        vendorId: vendor.authUserId,
        productId,
        payload: {
          productId: productId.id,
        },
        metadata: {
          author,
        },
      });
    } catch (e: any) {
      this.logger.error(
        `Unable to create event PRODUCT_REFUSED for product ${productId.id} : ${e.message}`,
        e,
      );
    }
  }

  private async getVendorFromProductId(productId: EntityId) {
    const { vendor } = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productId.id,
      },
      include: {
        vendor: { include: { user: true } },
      },
    });

    if (!vendor) throw new Error('Vendor not found');

    return vendor;
  }

  private async updateVariantInDatabase(
    { id }: EntityId,
    {
      inventory_quantity,
      price,
      condition,
    }: { inventory_quantity?: number; price?: string; condition?: Condition },
  ) {
    const concreteUpdates: Prisma.ProductVariantUpdateInput = {
      ...(inventory_quantity !== undefined && { quantity: inventory_quantity }),
      ...(condition !== undefined && { condition }),
      ...(price && { priceInCents: toCents(price) }),
    };

    if (Object.keys(concreteUpdates).length === 0) return;

    const currentVariant = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    const updatedVariant = await this.prisma.productVariant.update({
      where: {
        id,
      },
      data: concreteUpdates,
    });

    return {
      before: pick(currentVariant, Object.keys(concreteUpdates)),
      after: pick(updatedVariant, Object.keys(concreteUpdates)),
    };
  }

  private async updateProductInDatabase(
    { id }: EntityId,
    {
      status,
      manualNotation,
      EANCode,
      GTINCode,
      source,
      vendorId,
      product_type: productType,
    }: {
      status?: ProductStatus;
      manualNotation?: ProductNotation | null;
      EANCode?: string | null;
      GTINCode?: string | null;
      source?: string | null;
      vendorId?: string;
      product_type?: string;
    },
  ) {
    const concreteUpdates = {
      ...(status && { status }),
      ...(manualNotation && { manualNotation }),
      ...(EANCode && { EANCode }),
      ...(GTINCode && { GTINCode }),
      ...(source && { source }),
      ...(vendorId && { vendorId }),
      ...(productType && { productType }),
    };

    if (Object.keys(concreteUpdates).length === 0) return;

    const currentProduct = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    const updatedProduct = await this.prisma.product.update({
      where: {
        id,
      },
      data: concreteUpdates,
    });

    return {
      before: pick(currentProduct, Object.keys(concreteUpdates)),
      after: pick(updatedProduct, Object.keys(concreteUpdates)),
    };
  }

  private async notifyEvent({
    eventName,
    vendorId,
    productId,
    payload,
    metadata,
  }: {
    eventName: EventName;
    vendorId: string;
    productId: EntityId;
    payload: Record<string, string | number>;
    metadata: { author: Author; comment?: string };
  }) {
    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.VENDOR,
        aggregateId: vendorId,
        name: eventName,
        payload: {
          ...payload,
          productId: productId.id,
        },
        metadata,
      },
    });
    await this.queueClient.planProductIndexation(
      new UUID({ uuid: productId.id }),
    );
  }
}
