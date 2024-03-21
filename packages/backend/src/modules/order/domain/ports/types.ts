import {
  CommissionRuleType,
  Condition,
  OrderStatus,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import {
  Amount as AmountValueObject,
  Email,
  ShopifyID,
  Stock,
  URL,
  UUID,
  ValueDate,
} from '@libs/domain/value-objects';
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
    firstName: string;
    sellerName: string;
    fullName: string;
    email: string;
    isPro: boolean;
    previousOrderLines: {
      shippingSolution: string;
      productType: string;
    }[];
  };
};

export type OrderLine = {
  storeId: ShopifyID;
  price: AmountValueObject;
  discountInCents: number;
  shippingSolution: ShippingSolution;
  isPhysicalProduct: boolean;
  quantity: Stock;
  fulfillmentOrderShopifyId: number | undefined;
  product: {
    vendorId: string | undefined;
    name: string;
    productType: string;
    handle: string;
    image: URL | null;
    variantCondition?: Condition | null;
    modelYear?: string | null;
    gender?: string | null;
    brand?: string | null;
    size?: string | null;
    variantId: string | undefined;
    referenceUrl?: URL;
    createdAt: ValueDate;
  };
};

export type FulfillmentOrderToStore = {
  shopifyId: number;
};

export type Order = {
  id?: UUID;
  storeId: ShopifyID;
  status: OrderStatus;
  createdAt?: ValueDate;
  name: string;
  adminUrl: URL;
  paymentCheckoutLabel?: string;
  totalPrice: AmountValueObject;
  orderLines?: OrderLine[];
  fulfillmentOrders?: FulfillmentOrderToStore[];
  paidAt?: ValueDate;
  shippingAddress?: {
    address1: string;
    address2: string | null;
    company: string | null;
    city: string;
    phone: string | null;
    country: string;
    firstName: string;
    lastName: string;
    zip: string;
  };
  customer?: {
    id: UUID | null;
    email: Email;
    firstName: string;
    fullName: string;
  };
  vendor?: {
    storeId: ShopifyID;
    email: Email;
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

export type MetadataType = Record<
  string,
  string | number | boolean | undefined | null
>;
