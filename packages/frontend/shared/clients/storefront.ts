import { createGraphQLClient } from './base/graphql';

const STOREFRONT_URL = `${process.env.NEXT_PUBLIC_SHOP_BASE_URL}/api/2024-01/graphql`;

export const fetchStorefront = createGraphQLClient(
  STOREFRONT_URL,
  new Headers([
    [
      'X-Shopify-Storefront-Access-Token',
      process.env.NEXT_PUBLIC_STOREFRONT_PUBLIC_TOKEN,
    ],
  ]),
);
