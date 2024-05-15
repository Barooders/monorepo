import { Currency, ShippingSolution } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
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

export interface OrderLineForCommissionCompute {
  price: number;
  discount: number;
  productType: string;
  vendorId?: string | null;
  quantity: number;
  shippingSolution: ShippingSolution;
  forcedBuyerCommission?: number;
}

export interface RefundOptions {
  currency: Currency;
  amountInCents: number;
}

export abstract class IStoreClient {
  abstract getOrderPriceItems(orderId: UUID): Promise<{
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

  abstract refundOrder(orderId: UUID, options: RefundOptions): Promise<void>;

  abstract filterBikesVariantIdsFromVariantIdList(
    variantIds: string[],
  ): Promise<string[]>;

  abstract getAppliedDiscounts(orderId: UUID): Promise<DiscountApplication[]>;
}
