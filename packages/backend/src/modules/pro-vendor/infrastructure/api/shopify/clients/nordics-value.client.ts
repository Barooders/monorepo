import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class NordicsValueClient {
  private readonly logger = new Logger(NordicsValueClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.nordics_value.accessToken) {
      throw new Error('Missing access token for Nordics Value');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.nordics_value.apiUrl,
      accessToken: vendorConfig.nordics_value.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
