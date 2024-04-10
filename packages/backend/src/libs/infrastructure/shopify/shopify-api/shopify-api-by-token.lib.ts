import Shopify from 'shopify-api-node';

import { shopifyConfig } from '@config/shopify.config';
import { BAROODERS_NAMESPACE } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
/* eslint-disable import/no-named-as-default-member */
import newrelic from 'newrelic';
import { ShopifyError } from './types';

export class InstrumentedShopify extends Shopify {
  constructor(
    options: Shopify.IPublicShopifyConfig | Shopify.IPrivateShopifyConfig,
  ) {
    super(options);
  }

  getProduct = async (id: number) => {
    return newrelic.startSegment(
      `shopify:getProduct:${id}`,
      false,
      async () => {
        return this.product.get(id);
      },
    );
  };

  listProducts = async (options: any) => {
    return newrelic.startSegment('shopify:listProducts', false, async () => {
      return this.product.list(options);
    });
  };
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
