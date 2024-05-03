import Shopify from 'shopify-api-node';

import { shopifyConfig } from '@config/shopify.config';
import { BAROODERS_NAMESPACE } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
/* eslint-disable import/no-named-as-default-member */
import newrelic from 'newrelic';
import { ShopifyError } from './types';

const instrumentShopifyMethod = <T>(methodName: string, handler: () => T) => {
  return newrelic.startSegment(`shopify:${methodName}`, false, handler);
};

class InstrumentedProductClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async get(id: number) {
    return instrumentShopifyMethod('getProduct', () =>
      this.shopifyClient.product.get(id),
    );
  }

  async create(params: any) {
    return instrumentShopifyMethod('createProduct', () =>
      this.shopifyClient.product.create(params),
    );
  }

  async list(params: any) {
    return instrumentShopifyMethod('listProducts', () =>
      this.shopifyClient.product.list(params),
    );
  }

  async update(id: number, params: any) {
    return instrumentShopifyMethod('updateProduct', () =>
      this.shopifyClient.product.update(id, params),
    );
  }

  async delete(id: number) {
    return instrumentShopifyMethod('deleteProduct', () =>
      this.shopifyClient.product.delete(id),
    );
  }
}

class InstrumentedProductVariantClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async get(id: number) {
    return instrumentShopifyMethod('getProductVariant', () =>
      this.shopifyClient.productVariant.get(id),
    );
  }

  async create(productId: number, params: any) {
    return instrumentShopifyMethod('createProductVariant', () =>
      this.shopifyClient.productVariant.create(productId, params),
    );
  }

  async list(id: number) {
    return instrumentShopifyMethod('listProductVariants', () =>
      this.shopifyClient.productVariant.list(id),
    );
  }

  async update(id: number, params: any) {
    return instrumentShopifyMethod('updateProductVariant', () =>
      this.shopifyClient.productVariant.update(id, params),
    );
  }

  async delete(productId: number, id: number) {
    return instrumentShopifyMethod('deleteProductVariant', () =>
      this.shopifyClient.productVariant.delete(productId, id),
    );
  }
}

class InstrumentedOrderClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async get(id: number) {
    return instrumentShopifyMethod('getOrder', () =>
      this.shopifyClient.order.get(id),
    );
  }

  async fulfillmentOrders(id: number) {
    return instrumentShopifyMethod('getFulfillmentOrders', () =>
      this.shopifyClient.order.fulfillmentOrders(id),
    );
  }

  async create(params: any) {
    return instrumentShopifyMethod('createOrder', () =>
      this.shopifyClient.order.create(params),
    );
  }
}

class InstrumentedCustomerClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async search(params: any) {
    return instrumentShopifyMethod('searchCustomer', () =>
      this.shopifyClient.customer.search(params),
    );
  }

  async create(params: any) {
    return instrumentShopifyMethod('createCustomer', () =>
      this.shopifyClient.customer.create(params),
    );
  }

  async update(id: number, params: any) {
    return instrumentShopifyMethod('updateCustomer', () =>
      this.shopifyClient.customer.update(id, params),
    );
  }
}

class InstrumentedFulfillmentClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async list(id: number) {
    return instrumentShopifyMethod('listFulfillmentsFromOrder', () =>
      this.shopifyClient.fulfillment.list(id),
    );
  }

  async createV2(params: any) {
    return instrumentShopifyMethod('createFulfillmentV2', () =>
      this.shopifyClient.fulfillment.createV2(params),
    );
  }
}

class InstrumentedFulfillmentOrderClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async fulfillments(id: number) {
    return instrumentShopifyMethod('listFulfillmentsFromFulfillmentOrder', () =>
      this.shopifyClient.fulfillmentOrder.fulfillments(id),
    );
  }
}

class InstrumentedProductImageClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async create(productId: number, params: any) {
    return instrumentShopifyMethod('createProductImage', () =>
      this.shopifyClient.productImage.create(productId, params),
    );
  }

  async delete(productId: number, imageId: number) {
    return instrumentShopifyMethod('deleteProductImage', () =>
      this.shopifyClient.productImage.delete(productId, imageId),
    );
  }
}

class InstrumentedTransactionClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async create(id: number, params: any) {
    return instrumentShopifyMethod('createTransaction', () =>
      this.shopifyClient.transaction.create(id, params),
    );
  }
}

class InstrumentedMetafieldClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async create(params: any) {
    return instrumentShopifyMethod('createMetafield', () =>
      this.shopifyClient.metafield.create(params),
    );
  }

  async list(params: any) {
    return instrumentShopifyMethod('listMetafields', () =>
      this.shopifyClient.metafield.list(params),
    );
  }

  async update(id: number, params: any) {
    return instrumentShopifyMethod('updateMetafield', () =>
      this.shopifyClient.metafield.update(id, params),
    );
  }
}

class InstrumentedInventoryLevelClient {
  private shopifyClient: Shopify;

  constructor(shopifyClient: Shopify) {
    this.shopifyClient = shopifyClient;
  }

  async set(params: any) {
    return instrumentShopifyMethod('setInventoryLevel', () =>
      this.shopifyClient.inventoryLevel.set(params),
    );
  }
}

export class InstrumentedShopify {
  public product: InstrumentedProductClient;
  public productVariant: InstrumentedProductVariantClient;
  public productImage: InstrumentedProductImageClient;
  public order: InstrumentedOrderClient;
  public customer: InstrumentedCustomerClient;
  public transaction: InstrumentedTransactionClient;
  public fulfillment: InstrumentedFulfillmentClient;
  public fulfillmentOrder: InstrumentedFulfillmentOrderClient;
  public metafield: InstrumentedMetafieldClient;
  public inventoryLevel: InstrumentedInventoryLevelClient;

  constructor(
    options: Shopify.IPublicShopifyConfig | Shopify.IPrivateShopifyConfig,
  ) {
    const shopifyClient = new Shopify(options);
    this.product = new InstrumentedProductClient(shopifyClient);
    this.productVariant = new InstrumentedProductVariantClient(shopifyClient);
    this.productImage = new InstrumentedProductImageClient(shopifyClient);
    this.order = new InstrumentedOrderClient(shopifyClient);
    this.customer = new InstrumentedCustomerClient(shopifyClient);
    this.transaction = new InstrumentedTransactionClient(shopifyClient);
    this.fulfillment = new InstrumentedFulfillmentClient(shopifyClient);
    this.fulfillmentOrder = new InstrumentedFulfillmentOrderClient(
      shopifyClient,
    );
    this.metafield = new InstrumentedMetafieldClient(shopifyClient);
    this.inventoryLevel = new InstrumentedInventoryLevelClient(shopifyClient);
  }
}

const globalForShopifyApiByToken = global as unknown as {
  shopifyApiByToken: InstrumentedShopify;
};

export const DEFAULT_PLAN_CONFIG = {
  autoLimit: { calls: 1, interval: 3000, bucketSize: 1 },
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
  new InstrumentedShopify({
    shopName: shopifyConfig.shop,
    accessToken: shopifyConfig.backofficeApp.accessToken,
    ...PLUS_PLAN_CONFIG,
  });

if (process.env.NODE_ENV !== 'production')
  globalForShopifyApiByToken.shopifyApiByToken = shopifyApiByToken;
