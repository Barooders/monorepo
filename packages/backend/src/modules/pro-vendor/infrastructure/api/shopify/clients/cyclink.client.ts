import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class CyclinkClient {
  private readonly logger = new Logger(CyclinkClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.cyclink.accessToken) {
      throw new Error('Missing access token for Cyclink');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.cyclink.apiUrl,
      accessToken: vendorConfig.cyclink.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
