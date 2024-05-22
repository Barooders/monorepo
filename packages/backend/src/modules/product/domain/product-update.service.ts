import {
  AggregateName,
  Condition,
  Prisma,
  PrismaMainClient,
  ProductNotation,
  ProductStatus,
} from '@libs/domain/prisma.main.client';
import { ProductToUpdate, Variant } from '@libs/domain/product.interface';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { toCents } from '@libs/helpers/currency';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { pick } from 'lodash';
import { ProductRefusedDomainEvent } from './events/product.refused.domain-event';
import { ProductUpdatedDomainEvent } from './events/product.updated.domain-event';
import { NotificationService } from './notification.service';
import { UserNotAllowedException } from './ports/exceptions';
import { IPIMClient } from './ports/pim.client';
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
    private eventEmitter: EventEmitter2,
  ) {}

  async updateProduct(
    productId: UUID,
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

    await this.storeClient.updateProduct(productId, updates);
    const updatesAndPreviousValues = await this.updateProductInDatabase(
      productId,
      updates,
    );

    const vendor = await this.getVendorFromProductId(productId);
    this.eventEmitter.emit(
      ProductUpdatedDomainEvent.EVENT_NAME,
      new ProductUpdatedDomainEvent({
        aggregateId: vendor.authUserId,
        aggregateName: AggregateName.VENDOR,
        productInternalId: productId.uuid,
        payload: {
          updates: jsonStringify(updatesAndPreviousValues),
        },
        metadata: {
          author,
        },
      }),
    );

    if (notifyVendor) {
      await this.notificationService.notify(
        vendor.user.email,
        vendor.firstName,
      );
    }
  }

  async addProductImage(
    productId: UUID,
    image: ImageToUpload,
  ): Promise<ProductImage> {
    return await this.storeClient.addProductImage(productId, image);
  }

  async deleteProductImage(productId: UUID, imageId: string): Promise<void> {
    return await this.storeClient.deleteProductImage(productId, imageId);
  }

  async updateProductByUser(
    productId: UUID,
    productToUpdate: ProductToUpdate,
    { uuid: userId }: UUID,
  ): Promise<void> {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productId.uuid,
      },
    });

    if (product.vendorId !== userId) {
      throw new UserNotAllowedException(productId.uuid, userId, 'update');
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
        id: userId,
      },
    );
  }

  async updateProductVariant(
    productId: UUID,
    variantId: UUID,
    data: Partial<Variant>,
    author: Author,
  ) {
    await this.storeClient.updateProductVariant(variantId, data);
    const updatesAndPreviousValues = await this.updateVariantInDatabase(
      variantId,
      data,
    );

    try {
      const vendor = await this.getVendorFromProductId(productId);
      this.eventEmitter.emit(
        ProductUpdatedDomainEvent.EVENT_NAME,
        new ProductUpdatedDomainEvent({
          aggregateId: vendor.authUserId,
          aggregateName: AggregateName.VENDOR,
          productInternalId: productId.uuid,
          payload: {
            variantId: variantId.uuid,
            updates: jsonStringify(updatesAndPreviousValues),
          },
          metadata: {
            author,
          },
        }),
      );
    } catch (e: any) {
      this.logger.error(
        `Unable to create event PRODUCT_UPDATED when updating variant ${variantId.uuid} : ${e.message}`,
        e,
      );
    }
  }

  async deleteProductVariant(
    productId: UUID,
    variantId: UUID,
    author: Author,
  ): Promise<void> {
    await this.storeClient.deleteProductVariant(variantId);
    const productVariantInDB = await this.prisma.productVariant.delete({
      where: {
        id: variantId.uuid,
      },
      include: {
        product: true,
      },
    });
    this.eventEmitter.emit(
      ProductUpdatedDomainEvent.EVENT_NAME,
      new ProductUpdatedDomainEvent({
        aggregateId: productVariantInDB.product.vendorId,
        aggregateName: AggregateName.VENDOR,
        productInternalId: productId.uuid,
        payload: {
          variantId: variantId.uuid,
        },
        metadata: {
          comment: 'Product variant deleted',
          author,
        },
      }),
    );
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

    this.eventEmitter.emit(
      ProductUpdatedDomainEvent.EVENT_NAME,
      new ProductUpdatedDomainEvent({
        aggregateId: productVariantInDB.product.vendorId,
        aggregateName: AggregateName.VENDOR,
        productInternalId: productVariantInDB.productId,
        payload: {
          variantId: productVariantInDB.id,
          stockUpdate,
          newQuantity: productVariantInDB.quantity,
        },
        metadata: {
          comment: 'Variant stock updated',
          author,
        },
      }),
    );
  }

  async moderateProduct(
    productId: UUID,
    action: ModerationAction,
    author: Author,
  ): Promise<void> {
    switch (action) {
      case ModerationAction.APPROVE:
        await this.storeClient.approveProduct(productId);
        break;
      case ModerationAction.REJECT:
        await this.rejectProduct(productId, author);
        break;
      default:
        throw new Error(`Action ${action} is not supported`);
    }
  }

  private async rejectProduct(productId: UUID, author: Author): Promise<void> {
    await this.updateProduct(
      productId,
      { status: ProductStatus.DRAFT },
      { notifyVendor: false },
      author,
    );
    await this.storeClient.rejectProduct(productId);

    try {
      const vendor = await this.getVendorFromProductId(productId);
      this.eventEmitter.emit(
        ProductRefusedDomainEvent.EVENT_NAME,
        new ProductRefusedDomainEvent({
          aggregateId: vendor.authUserId,
          aggregateName: AggregateName.VENDOR,
          productInternalId: productId.uuid,
          metadata: {
            author,
          },
        }),
      );
    } catch (e: any) {
      this.logger.error(
        `Unable to create event PRODUCT_REFUSED for product ${productId.uuid} : ${e.message}`,
        e,
      );
    }
  }

  private async getVendorFromProductId(productId: UUID) {
    const { vendor } = await this.prisma.product.findUniqueOrThrow({
      where: {
        id: productId.uuid,
      },
      include: {
        vendor: { include: { user: true } },
      },
    });

    if (!vendor) throw new Error('Vendor not found');

    return vendor;
  }

  private async updateVariantInDatabase(
    { uuid: id }: UUID,
    {
      inventory_quantity,
      price,
      compare_at_price,
      condition,
    }: {
      inventory_quantity?: number;
      price?: string;
      compare_at_price?: string | null;
      condition?: Condition;
    },
  ) {
    const concreteUpdates: Prisma.ProductVariantUpdateInput = {
      ...(inventory_quantity !== undefined && { quantity: inventory_quantity }),
      ...(condition !== undefined && { condition }),
      ...(price && { priceInCents: toCents(price) }),
      ...(compare_at_price && {
        compareAtPriceInCents: toCents(compare_at_price),
      }),
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
    { uuid: id }: UUID,
    {
      body_html,
      status,
      manualNotation,
      EANCode,
      GTINCode,
      source,
      vendorId,
      product_type: productType,
    }: {
      body_html?: string;
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
      ...(body_html && { description: body_html }),
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
}
