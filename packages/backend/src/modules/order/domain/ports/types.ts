import {
  CommissionRuleType,
  Condition,
  Currency,
  Order,
  OrderStatus,
  PriceOffer,
  SalesChannelName,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { CurrencyCode } from '@libs/types/common/money.types';

export type OrderPaidData = {
  order: {
    shopifyId: string;
    name: string;
    shipmentEmail: string;
    createdAt: string;
    totalPrice: string;
  };
  product: {
    shippingSolution: ShippingSolution;
    name: string;
    price: string;
    referenceId: string;
    variantTitle: string;
    handle: string;
    referenceUrl: string;
    createdAt: Date;
    chatConversationLink: string;
    productType: string;
  };
  customer: {
    email: string;
    address: string;
    phone: string;
    fullName: string;
  };
  vendor: {
    shopifyId: string;
    email: string;
    sellerName: string;
    firstName: string;
    fullName: string;
    isPro: boolean;
    previousOrderLines: {
      shippingSolution: ShippingSolution;
      productType: string;
    }[];
  };
};

export type OrderCreatedData = {
  order: {
    name: string;
    adminUrl: string;
    paymentMethod: string;
    totalPrice: string;
  };
  product: {
    name: string;
    referenceUrl: string;
    createdAt: Date;
  };
  customer: {
    email: string;
    firstName: string;
    fullName: string;
  };
};

export type OrderCancelledData = {
  customer: { email: string; fullName: string; firstName: string };
  vendor: { email: string; fullName: string; firstName: string } | null;
  productName: string;
  order: Order;
};

export type OrderHandDeliveredData = {
  customer: {
    id: string | undefined;
    email: string | null | undefined;
    firstName: string;
    fullName: string;
  };
  vendor: {
    id: string | undefined;
    email: string | null | undefined;
    firstName: string;
    fullName: string;
  };
  orderName: string;
  productName: string;
};

export type FeedBackRequest = {
  customer: {
    email: string;
    fullName: string;
    id?: string;
  };
  orderName: string;
};

export type Amount = {
  amountInCents: number;
  currency: CurrencyCode;
};

export const BuyerPriceLines = {
  BUYER_SHIPPING: 'BUYER_SHIPPING',
  BUYER_COMMISSION: 'BUYER_COMMISSION',
  BUYER_DISCOUNT: 'BUYER_DISCOUNT',
};

export type BuyerPriceLines =
  (typeof BuyerPriceLines)[keyof typeof BuyerPriceLines];

export const PRODUCT_PRICE = 'PRODUCT_PRICE' as const;
export const PRODUCT_DISCOUNT = 'PRODUCT_DISCOUNT' as const;

type PriceLine =
  | typeof PRODUCT_PRICE
  | typeof PRODUCT_DISCOUNT
  | CommissionRuleType
  | BuyerPriceLines;

export type AccountPageOrder = {
  viewer: 'buyer' | 'vendor';
  contact: {
    name: string | null;
    signedInAtTimestamp: number;
    imageSrc: string | null;
  } | null;
  chatLink: string | null;
  priceDetail: {
    lines: {
      type: PriceLine;
      amount: Amount;
    }[];
    total: Amount;
  };
  orderHistory: {
    status: OrderStatus;
    updatedAt: string | null;
    isCompleted: boolean;
  }[];
};

export interface TrackingInfo {
  trackingId?: string;
  trackingUrl: string;
}

export interface DiscountApplication {
  code: string;
  details: {
    target_type: string;
    type: string;
    value: string;
    value_type: string;
    allocation_method: string;
    target_selection: string;
  };
}

export type OrderLineToStore = {
  shopifyId?: string;
  name: string;
  vendorId?: string;
  priceInCents: number;
  discountInCents: number;
  shippingSolution: ShippingSolution;
  priceCurrency: Currency;
  productType: string;
  productHandle: string;
  productImage: string | null;
  variantCondition?: Condition | null;
  productModelYear?: string | null;
  productGender?: string | null;
  productBrand?: string | null;
  productSize?: string | null;
  quantity: number;
  productVariantId?: string;
  fulfillmentOrderShopifyId?: number;
};

export type FulfillmentOrderToStore = {
  shopifyId: number;
};

export type OrderToStore = {
  order: {
    salesChannelName: SalesChannelName;
    shopifyId?: string;
    name: string;
    status: OrderStatus;
    customerEmail: string;
    customerId: string | null;
    totalPriceInCents: number;
    totalPriceCurrency: Currency;
    shippingAddressAddress1: string;
    shippingAddressAddress2: string | null;
    shippingAddressCompany: string | null;
    shippingAddressCity: string;
    shippingAddressPhone: string | null;
    shippingAddressCountry: string;
    shippingAddressFirstName: string;
    shippingAddressLastName: string;
    shippingAddressZip: string;
  };
  orderLines: OrderLineToStore[];
  fulfillmentOrders: FulfillmentOrderToStore[];
  payment?: {
    methodName: string;
    checkoutToken: string | null;
  };
  priceOffers: Pick<PriceOffer, 'id'>[];
};
