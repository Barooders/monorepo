import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class TCHClient {
  private readonly logger = new Logger(TCHClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.tch.accessToken) {
      throw new Error('Missing access token for TCH');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.tch.apiUrl,
      accessToken: vendorConfig.tch.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
