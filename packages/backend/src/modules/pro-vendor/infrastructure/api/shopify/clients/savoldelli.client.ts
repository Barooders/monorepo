import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class SavoldelliClient {
  private readonly logger = new Logger(SavoldelliClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.savoldelli.accessToken) {
      throw new Error('Missing access token for savoldelli');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.savoldelli.apiUrl,
      accessToken: vendorConfig.savoldelli.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
