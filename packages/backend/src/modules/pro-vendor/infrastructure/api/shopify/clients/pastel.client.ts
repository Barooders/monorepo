import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class PastelClient {
  private readonly logger = new Logger(PastelClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.pastel.accessToken) {
      throw new Error('Missing access token for Pastel');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.pastel.apiUrl,
      accessToken: vendorConfig.pastel.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
