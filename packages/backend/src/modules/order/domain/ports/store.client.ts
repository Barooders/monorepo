import { Currency } from '@libs/domain/prisma.main.client';
import { EntityId } from '@libs/domain/product.interface';
import {
  Amount,
  BuyerPriceLines,
  DiscountApplication,
  TrackingInfo,
} from './types';

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

  abstract getAppliedDiscounts(
    orderStoreId: string,
  ): Promise<DiscountApplication[]>;
}
