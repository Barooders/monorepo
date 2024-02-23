import { vendorConfig } from '@config/vendor/vendor.config';
import { DEFAULT_PLAN_AUTO_LIMIT_CONFIG } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';

@Injectable()
export class ProjetBoussoleClient {
  private readonly logger = new Logger(ProjetBoussoleClient.name);
  private shopifyApiNode: Shopify;

  constructor() {
    this.logger.debug('Will instanciate Shopify API node');

    if (!vendorConfig.projet_boussole.accessToken) {
      throw new Error('Missing access token for Projet Boussole');
    }

    this.shopifyApiNode = new Shopify({
      shopName: vendorConfig.projet_boussole.apiUrl,
      accessToken: vendorConfig.projet_boussole.accessToken,
      autoLimit: DEFAULT_PLAN_AUTO_LIMIT_CONFIG,
    });
  }
  getClient(): Shopify {
    return this.shopifyApiNode;
  }
}
