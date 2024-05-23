import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class BaroudeurClient {
  private readonly logger = new Logger(BaroudeurClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!vendorConfig.baroudeur_cycles.accessToken) {
      throw new Error('Missing access token for Baroudeur');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.baroudeur_cycles.apiUrl,
      accessToken: vendorConfig.baroudeur_cycles.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
