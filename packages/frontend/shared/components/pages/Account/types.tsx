export interface AccountPageOrder {
  orderShopifyId: string;
  name: string;
  status: string;
  createdAt: string;
  totalPrice: string;
  productVariant: {
    productType: string;
    handle: string;
    tags: string[];
    image: { src: string };
    title: string;
    price: string;
  };
}

export interface AccountPageOrderForVendor extends AccountPageOrder {
  amountForVendor: string;
}

export const enum OrderStatus {
  CREATED = 'CREATED',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  RETURNED = 'RETURNED',
  CANCELED = 'CANCELED',
  DELIVERED = 'DELIVERED',
  PAID_OUT = 'PAID_OUT',
  LABELED = 'LABELED',
}

export const enum ShippingSolution {
  HAND_DELIVERY = 'HAND_DELIVERY',
  VENDOR = 'VENDOR',
  GEODIS = 'GEODIS',
  SENDCLOUD = 'SENDCLOUD',
}

export const enum FulfillmentOrderStatus {
  CANCELED = 'CANCELED',
  CLOSED = 'CLOSED',
  IN_PROGRESS = 'IN_PROGRESS',
  INCOMPLETE = 'INCOMPLETE',
  OPEN = 'OPEN',
}
