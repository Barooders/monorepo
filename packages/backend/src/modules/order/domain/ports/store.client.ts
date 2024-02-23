import { Currency } from '@libs/domain/prisma.main.client';
import { EntityId } from '@libs/domain/product.interface';
import { Amount as AmountObject, URL } from '@libs/domain/value-objects';
import { Amount, BuyerPriceLines, TrackingInfo } from './types';

export type OrderInChat = {
  orderShopifyId: string;
  chatConversationId: string;
};

export type StoreFulfilledFulfillmentOrder = {
  shopifyId: number;
  fulfilledItems: {
    fulfillmentItemShopifyId: number;
    productVariantId: string;
  }[];
};

export interface ProductCreationInput {
  title: string;
  description: string;
  vendor: string;
  productType: string;
  featuredImgSrc: URL;
  variants: { price: AmountObject }[];
}

export interface ProductVariant {
  price: number;
  discount: number;
  productType: string;
  vendorId: string;
}

export interface RefundOptions {
  currency: Currency;
  amountInCents: number;
}

export abstract class IStoreClient {
  abstract isHandDeliveryOrder(orderShopifyId: string): Promise<boolean>;

  abstract getOrderPriceItems(orderShopifyId: string): Promise<{
    lines: {
      type: BuyerPriceLines;
      amount: Amount;
    }[];
    total: Amount;
  }>;

  abstract createProduct(
    product: ProductCreationInput,
  ): Promise<{ id: string; variants: { id: string }[] }>;
  abstract publishProduct(productId: string): Promise<void>;

  abstract fulfillFulfillmentOrder(
    fulfillmentOrderId: string,
    trackingInfo: TrackingInfo,
  ): Promise<StoreFulfilledFulfillmentOrder>;

  abstract getFulfillmentOrderId(
    orderShopifyId: string,
    orderLineShopifyId: string,
  ): Promise<number | undefined>;

  abstract refundOrder(
    orderId: EntityId,
    options: RefundOptions,
  ): Promise<void>;

  abstract filterBikesVariantIdsFromVariantIdList(
    variantIds: string[],
  ): Promise<string[]>;

  abstract cleanOldCommissions(): Promise<void>;
}
