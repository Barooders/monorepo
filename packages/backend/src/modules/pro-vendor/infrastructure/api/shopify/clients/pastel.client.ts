import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PastelClient {
  private readonly logger = new Logger(PastelClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!vendorConfig.pastel.accessToken) {
      throw new Error('Missing access token for Pastel');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.pastel.apiUrl,
      accessToken: vendorConfig.pastel.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
