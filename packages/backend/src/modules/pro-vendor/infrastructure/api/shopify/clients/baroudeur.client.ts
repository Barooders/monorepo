import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class BaroudeurClient {
  private readonly logger = new Logger(BaroudeurClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.baroudeur_cycles.accessToken) {
      throw new Error('Missing access token for Baroudeur');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.baroudeur_cycles.apiUrl,
      accessToken: vendorConfig.baroudeur_cycles.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
