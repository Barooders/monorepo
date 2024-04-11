import Shopify from 'shopify-api-node';

import { shopifyConfig } from '@config/shopify.config';
import { BAROODERS_NAMESPACE } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
/* eslint-disable import/no-named-as-default-member */
import newrelic from 'newrelic';
import { ShopifyError } from './types';

class InstrumentedProductClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async get(id: number) {
    return newrelic.startSegment(
      `shopify:getProduct:${id}`,
      false,
      async () => {
        return this.shopifyClient.product.get(id);
      },
    );
  }

  async create(params: any) {
    return newrelic.startSegment('shopify:createProduct', false, async () => {
      return this.shopifyClient.product.create(params);
    });
  }

  async list(params: any) {
    return newrelic.startSegment('shopify:listProducts', false, async () => {
      return this.shopifyClient.product.list(params);
    });
  }

  async update(id: number, params: any) {
    return newrelic.startSegment(
      `shopify:updateProduct:${id}`,
      false,
      async () => {
        return this.shopifyClient.product.update(id, params);
      },
    );
  }

  async delete(id: number) {
    return newrelic.startSegment(
      `shopify:deleteProduct:${id}`,
      false,
      async () => {
        return this.shopifyClient.product.delete(id);
      },
    );
  }
}

class InstrumentedOrderClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async get(id: number) {
    return newrelic.startSegment(`shopify:getOrder:${id}`, false, async () => {
      return this.shopifyClient.order.get(id);
    });
  }

  async fulfillmentOrders(id: number) {
    return newrelic.startSegment(
      'shopify:getFulfillmentOrders',
      false,
      async () => {
        return this.shopifyClient.order.fulfillmentOrders(id);
      },
    );
  }

  async create(params: any) {
    return newrelic.startSegment('shopify:createOrder', false, async () => {
      return this.shopifyClient.order.create(params);
    });
  }
}

class InstrumentedCustomerClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async search(params: any) {
    return newrelic.startSegment('shopify:searchCustomer', false, async () => {
      return this.shopifyClient.customer.search(params);
    });
  }

  async create(params: any) {
    return newrelic.startSegment('shopify:createCustomer', false, async () => {
      return this.shopifyClient.customer.create(params);
    });
  }
}

class InstrumentedFulfillmentClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async list(id: number) {
    return newrelic.startSegment(
      'shopify:listFulfillments',
      false,
      async () => {
        return this.shopifyClient.fulfillment.list(id);
      },
    );
  }

  async createV2(params: any) {
    return newrelic.startSegment(
      'shopify:createFulfillmentV2',
      false,
      async () => {
        return this.shopifyClient.fulfillment.createV2(params);
      },
    );
  }
}

class InstrumentedTransactionClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async create(id: number, params: any) {
    return newrelic.startSegment(
      'shopify:createTransaction',
      false,
      async () => {
        return this.shopifyClient.transaction.create(id, params);
      },
    );
  }
}

class InstrumentedMetafieldClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async create(params: any) {
    return newrelic.startSegment('shopify:createMetafield', false, async () => {
      return this.shopifyClient.metafield.create(params);
    });
  }

  async list(params: any) {
    return newrelic.startSegment('shopify:listMetafields', false, async () => {
      return this.shopifyClient.metafield.list(params);
    });
  }

  async update(id: number, params: any) {
    return newrelic.startSegment(
      `shopify:updateMetafield:${id}`,
      false,
      async () => {
        return this.shopifyClient.metafield.update(id, params);
      },
    );
  }
}

export class InstrumentedShopify {
  public product: InstrumentedProductClient;
  public order: InstrumentedOrderClient;
  public customer: InstrumentedCustomerClient;
  public transaction: InstrumentedTransactionClient;
  public fulfillment: InstrumentedFulfillmentClient;
  public metafield: InstrumentedMetafieldClient;

  constructor(
    options: Shopify.IPublicShopifyConfig | Shopify.IPrivateShopifyConfig,
  ) {
    const shopifyClient = new Shopify(options);
    this.product = new InstrumentedProductClient(shopifyClient);
    this.order = new InstrumentedOrderClient(shopifyClient);
    this.customer = new InstrumentedCustomerClient(shopifyClient);
    this.transaction = new InstrumentedTransactionClient(shopifyClient);
    this.fulfillment = new InstrumentedFulfillmentClient(shopifyClient);
    this.metafield = new InstrumentedMetafieldClient(shopifyClient);
  }
}

const globalForShopifyApiByToken = global as unknown as {
  shopifyApiByToken: Shopify;
};

export const DEFAULT_PLAN_CONFIG = {
  autoLimit: { calls: 2, interval: 1000, bucketSize: 40 },
};

export const PLUS_PLAN_CONFIG = {
  autoLimit: { calls: 4, interval: 1000, bucketSize: 80 },
};

export const parseShopifyError = (
  error: unknown,
  defaultErrorMessage?: string,
): string => {
  const shopifyError = error as ShopifyError;

  return shopifyError?.response?.body?.error ||
    shopifyError?.response?.body?.errors
    ? jsonStringify(shopifyError.response.body.errors)
    : defaultErrorMessage ?? 'No specific error message in Shopify';
};

export const findMetafield = (
  metafields: Shopify.IMetafield[],
  searchedKey: string,
  searchedNamespace = BAROODERS_NAMESPACE,
): Shopify.IMetafield | undefined => {
  return metafields.find(
    ({ key, namespace }) =>
      key === searchedKey && namespace === searchedNamespace,
  );
};

export const isHandDeliveryOrder = (orderData: Shopify.IOrder) => {
  return orderData.shipping_lines.some(
    ({ code }) => code === shopifyConfig.handDeliveryMethodName,
  );
};

/**
 * @deprecated We should always map all products in an order
 */
export const getSingleProductInOrder = (orderData: Shopify.IOrder) => {
  return orderData.line_items.find(
    ({ product_id, requires_shipping }) =>
      !!product_id && requires_shipping === true,
  );
};

// Prevents too many instances of shopify api node to be initialized
export const shopifyApiByToken =
  globalForShopifyApiByToken.shopifyApiByToken ||
  new Shopify({
    shopName: shopifyConfig.shop,
    accessToken: shopifyConfig.backofficeApp.accessToken,
    ...PLUS_PLAN_CONFIG,
  });

if (process.env.NODE_ENV !== 'production')
  globalForShopifyApiByToken.shopifyApiByToken = shopifyApiByToken;
