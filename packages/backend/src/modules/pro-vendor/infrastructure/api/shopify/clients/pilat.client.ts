import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class PilatClient {
  private readonly logger = new Logger(PilatClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.pilat.accessToken) {
      throw new Error('Missing access token for Cycles Pilat');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.pilat.apiUrl,
      accessToken: vendorConfig.pilat.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
