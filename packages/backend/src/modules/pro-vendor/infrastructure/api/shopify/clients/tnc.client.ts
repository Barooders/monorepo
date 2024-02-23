import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class TNCClient {
  private readonly logger = new Logger(TNCClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.tnc.accessToken) {
      throw new Error('Missing access token for TNC');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.tnc.apiUrl,
      accessToken: vendorConfig.tnc.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
