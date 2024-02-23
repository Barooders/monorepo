import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class VeloMeldoisClient {
  private readonly logger = new Logger(VeloMeldoisClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.velo_meldois.accessToken) {
      throw new Error('Missing access token for VeloMeldois');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.velo_meldois.apiUrl,
      accessToken: vendorConfig.velo_meldois.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
