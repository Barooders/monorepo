import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class WillemClient {
  private readonly logger = new Logger(WillemClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.willemd.accessToken) {
      throw new Error('Missing access token for Willem');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.willemd.apiUrl,
      accessToken: vendorConfig.willemd.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
