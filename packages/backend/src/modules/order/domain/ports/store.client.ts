import {
  Currency,
  SalesChannelName,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
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
  shopifyId?: number;
  fulfilledItems: {
    shopifyId?: number;
    productVariantId: string;
    quantity: number;
  }[];
};

export interface OrderLineForCommissionCompute {
  salesChannelName: SalesChannelName;
  priceInCents: number;
  discountInCents: number;
  productType: string;
  vendorId?: string | null;
  quantity: number;
  shippingSolution: ShippingSolution;
  forcedBuyerCommissionInCents?: number;
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
    itemsToBeFulfilled: { productVariantId: string; quantity: number }[],
    trackingInfo: TrackingInfo,
  ): Promise<StoreFulfilledFulfillmentOrder>;

  abstract refundOrder(orderId: UUID, options: RefundOptions): Promise<void>;

  abstract filterBikesVariantIdsFromVariantIdList(
    variantIds: string[],
  ): Promise<string[]>;

  abstract getAppliedDiscounts(orderId: UUID): Promise<DiscountApplication[]>;
}
