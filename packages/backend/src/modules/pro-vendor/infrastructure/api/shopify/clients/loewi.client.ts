import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class LoewiClient {
  private readonly logger = new Logger(LoewiClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.loewi.accessToken) {
      throw new Error('Missing access token for Loewi');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.loewi.apiUrl,
      accessToken: vendorConfig.loewi.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
