import { get } from 'env-var';
import envConfig from './env/env.config';

export const shopifyConfig = {
  shop: envConfig.externalServices.shopify.shop,
  shopDNS: envConfig.externalServices.shopify.shopDns,
  shopLocation: envConfig.locationId,
  handDeliveryMethodName: 'Remise en main propre',

  shopAdminWebhookSecret:
    envConfig.externalServices.shopify.shopAdminWebhookSecret,

  /**
   * Normally this is something that should be fetched once and stored in db
   * for each store, however since we are developing this for a single app, for
   * the sake of simplifying our codebase, we configure it manually here.
   */
  shopOnlineStorePublicationId:
    envConfig.externalServices.shopify.shopOnlineStorePublicationId,
  mobileAppPublicationId: envConfig.mobileAppPublicationId,

  // Shopify credentials from backoffice generated app
  backofficeApp: {
    apiKey: envConfig.externalServices.shopify.apiKey,
    apiSecret: envConfig.externalServices.shopify.apiSecret,
    accessToken:
      get('RUN_MODE').default('web').asString() === 'console'
        ? envConfig.externalServices.shopify.synchroAccessToken
        : envConfig.externalServices.shopify.accessToken,
  },

  // Shopify credentials from partners dashboard generated app
  customApp: {
    apiKey: envConfig.externalServices.shopify.customAppApiKey,
    apiSecret: envConfig.externalServices.shopify.customAppApiSecret,
    scopes: envConfig.externalServices.shopify.customAppScopes,
    hostname: envConfig.hostname.replace(/^https?:\/\//, ''),
  },
  shopifyMultipassSecret: envConfig.externalServices.shopify.multipassSecret,
};
