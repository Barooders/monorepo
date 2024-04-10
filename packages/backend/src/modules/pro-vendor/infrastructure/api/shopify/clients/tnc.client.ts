import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class TNCClient {
  private readonly logger = new Logger(TNCClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    if (!vendorConfig.tnc.accessToken) {
      throw new Error('Missing access token for TNC');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.tnc.apiUrl,
      accessToken: vendorConfig.tnc.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
