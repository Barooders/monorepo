import { envConfigs } from '@config/env/env.config';

export type EnvType = 'production' | 'staging';

export const DEBUG = process.env.DEBUG === 'true';

export const envConfig = {
  staging: {
    baseUrl: `https://${envConfigs.staging.externalServices.shopify.shop}/admin/api/2023-04/graphql.json`,
    apiToken: envConfigs.staging.externalServices.shopify.accessToken,
  },
  production: {
    baseUrl: `https://${envConfigs.production.externalServices.shopify.shop}/admin/api/2023-04/graphql.json`,
    apiToken: envConfigs.production.externalServices.shopify.accessToken,
  },
};

export const metafieldOwnerTypes = [
  'COLLECTION',
  'CUSTOMER',
  'DRAFTORDER',
  'ORDER',
  'PRODUCT',
  'PRODUCTVARIANT',
];

export const metafieldNamespacesToSync = ['barooders', 'custom'];

export const publicationChannels = [
  'Online Store',
  'Shopify GraphiQL App',
  'Web + App + Hasura',
];
