import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class AllCyclesClient {
  private readonly logger = new Logger(AllCyclesClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.all_cycles.accessToken) {
      throw new Error('Missing access token for All Cycles');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.all_cycles.apiUrl,
      accessToken: vendorConfig.all_cycles.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
