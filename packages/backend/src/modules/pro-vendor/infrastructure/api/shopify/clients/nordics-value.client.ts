import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class NordicsValueClient {
  private readonly logger = new Logger(NordicsValueClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    if (!vendorConfig.nordics_value.accessToken) {
      throw new Error('Missing access token for Nordics Value');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.nordics_value.apiUrl,
      accessToken: vendorConfig.nordics_value.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
