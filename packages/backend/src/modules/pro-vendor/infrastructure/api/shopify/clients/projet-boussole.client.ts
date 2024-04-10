import { vendorConfig } from '@config/vendor/vendor.config';
import {
  DEFAULT_PLAN_CONFIG,
  InstrumentedShopify,
} from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ProjetBoussoleClient {
  private readonly logger = new Logger(ProjetBoussoleClient.name);
  private shopifyApiNode: InstrumentedShopify;

  constructor() {
    this.logger.debug('Will instanciate InstrumentedShopify API node');

    if (!vendorConfig.projet_boussole.accessToken) {
      throw new Error('Missing access token for Projet Boussole');
    }

    this.shopifyApiNode = new InstrumentedShopify({
      shopName: vendorConfig.projet_boussole.apiUrl,
      accessToken: vendorConfig.projet_boussole.accessToken,
      ...DEFAULT_PLAN_CONFIG,
    });
  }
  getClient(): InstrumentedShopify {
    return this.shopifyApiNode;
  }
}
