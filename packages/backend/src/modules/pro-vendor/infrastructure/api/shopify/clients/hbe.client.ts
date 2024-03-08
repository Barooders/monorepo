import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class HbeClient {
  private readonly logger = new Logger(HbeClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.hbe_shopify.accessToken) {
      throw new Error('Missing access token for HBE');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.hbe_shopify.apiUrl,
      accessToken: vendorConfig.hbe_shopify.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
