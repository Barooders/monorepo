import { jsonStringify } from '@libs/helpers/json';
import { parseShopifyError } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { ProductOutOfStockException } from '@modules/pro-vendor/domain/ports/exceptions';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import Shopify from 'shopify-api-node';
import { AllCyclesClient } from './clients/all-cycles.client';
import { BaroudeurClient } from './clients/baroudeur.client';
import { ChrisBikesClient } from './clients/chris-bikes.client';
import { CyclinkClient } from './clients/cyclink.client';
import { HbeClient } from './clients/hbe.client';
import { LoewiClient } from './clients/loewi.client';
import { MintBikesClient } from './clients/mint-bikes.client';
import { NordicsValueClient } from './clients/nordics-value.client';
import { PastelClient } from './clients/pastel.client';
import { PilatClient } from './clients/pilat.client';
import { ProjetBoussoleClient } from './clients/projet-boussole.client';
import { TCHClient } from './clients/tch.client';
import { TechniCyclesClient } from './clients/techni-cycles.client';
import { TNCClient } from './clients/tnc.client';
import { VeloMeldoisClient } from './clients/velo-meldois.client';
import { WillemClient } from './clients/willem.client';

export interface ShopifyOrderInput {
  order: {
    discount: number;
    name: string;
  };
  lineItems: { variantShopifyId: number; quantity: number }[];
  customer: {
    shippingAddress: {
      firstName: string;
      lastName: string;
      address1: string;
      address2?: string;
      phone: string;
      city: string;
      country: string;
      zip: string;
    };
    obfuscatedEmail: string;
    realEmail: string;
  };
}
@Injectable()
export class ShopifyClient {
  private readonly logger = new Logger(ShopifyClient.name);
  constructor(
    private readonly vendorConfigService: IVendorConfigService,
    private chrisBikesClient: ChrisBikesClient,
    private pilatClient: PilatClient,
    private mintBikesClient: MintBikesClient,
    private projetBoussoleClient: ProjetBoussoleClient,
    private nordicsValueClient: NordicsValueClient,
    private cyclinkClient: CyclinkClient,
    private hbeClient: HbeClient,
    private tchClient: TCHClient,
    private pastelClient: PastelClient,
    private techniCyclesClient: TechniCyclesClient,
    private willemClient: WillemClient,
    private loewiClient: LoewiClient,
    private baroudeurClient: BaroudeurClient,
    private veloMeldoisClient: VeloMeldoisClient,
    private tncClient: TNCClient,
    private allCyclesClient: AllCyclesClient,
  ) {}

  async getAllProducts(sinceDate?: Date): Promise<Shopify.IProduct[] | null> {
    let params = {
      limit: 250,
      updated_at_min: sinceDate?.toISOString(),
    };
    let products: Shopify.IProduct[] = [];

    do {
      const newProducts =
        await this.getOrCreateShopifyApiNode().product.list(params);

      products = [...products, ...newProducts];

      params = newProducts.nextPageParameters;
    } while (params !== undefined);

    return products;
  }

  async getProduct(productId: number): Promise<Shopify.IProduct | null> {
    try {
      return await this.getOrCreateShopifyApiNode().product.get(productId);
    } catch (error) {
      throw new Error(`Could not get product from Shopify because: ${error}`);
    }
  }

  async getProductMetafields(productId: number): Promise<Shopify.IMetafield[]> {
    return this.getOrCreateShopifyApiNode().metafield.list({
      metafield: { owner_resource: 'product', owner_id: productId },
      limit: 250,
    });
  }

  async createOrder({
    order,
    lineItems,
    customer: { shippingAddress, obfuscatedEmail, realEmail },
  }: ShopifyOrderInput): Promise<Shopify.IOrder> {
    const sharedAddress = {
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      address1: shippingAddress.address1,
      address2: shippingAddress.address2,
      phone: shippingAddress.phone,
      city: shippingAddress.city,
      country: shippingAddress.country,
      zip: shippingAddress.zip,
    };

    const sendDiscountedPrice =
      this.vendorConfigService.getVendorConfig().order?.sendDiscountedPrice;

    const orderToCreate = {
      ...(sendDiscountedPrice
        ? { total_discounts: order.discount.toFixed(2) }
        : {}),
      line_items: lineItems.map(
        ({ variantShopifyId: variant_id, quantity }) => ({
          variant_id,
          quantity,
        }),
      ),
      customer: {
        first_name: sharedAddress.first_name,
        last_name: sharedAddress.last_name,
        email: obfuscatedEmail,
        ...(this.vendorConfigService.getVendorConfig().order
          ?.sendRealCustomerEmail
          ? { note: realEmail }
          : {}),
      },
      billing_address: sharedAddress,
      shipping_address: sharedAddress,
      email: obfuscatedEmail,
      financial_status: 'paid',
      tags: `barooders; order: ${order.name}`,
      inventory_behaviour: 'decrement_obeying_policy',
    };

    try {
      this.logger.debug(`Creating order with ${jsonStringify(orderToCreate)}`);
      return await this.getOrCreateShopifyApiNode().order.create(orderToCreate);
    } catch (error: any) {
      const errorMessage = parseShopifyError(error);

      if (errorMessage.includes('Unable to reserve inventory')) {
        throw new ProductOutOfStockException(jsonStringify(lineItems));
      }

      this.logger.error(errorMessage, error);
      throw new Error(
        `Cannot create order: ${error.message} because ${errorMessage}`,
      );
    }
  }

  async getOrderFulfillments(
    orderShopifyId: number,
  ): Promise<Shopify.IFulfillment[]> {
    return this.getOrCreateShopifyApiNode().fulfillment.list(orderShopifyId);
  }

  async isUp(): Promise<boolean> {
    return (
      (await this.getOrCreateShopifyApiNode().product.list({ limit: 1 }))
        .length > 0
    );
  }

  private getOrCreateShopifyApiNode(): Shopify {
    switch (this.vendorConfigService.getVendorConfig().slug) {
      case 'chris_bikes':
        return this.chrisBikesClient.getClient();
      case 'mint_bikes':
        return this.mintBikesClient.getClient();
      case 'nordics_value':
        return this.nordicsValueClient.getClient();
      case 'projet_boussole':
        return this.projetBoussoleClient.getClient();
      case 'cyclink':
        return this.cyclinkClient.getClient();
      case 'hbe_shopify':
        return this.hbeClient.getClient();
      case 'velo_meldois':
        return this.veloMeldoisClient.getClient();
      case 'tnc':
        return this.tncClient.getClient();
      case 'tch':
        return this.tchClient.getClient();
      case 'pastel':
        return this.pastelClient.getClient();
      case 'techni_cycles':
        return this.techniCyclesClient.getClient();
      case 'willemd':
        return this.willemClient.getClient();
      case 'loewi':
        return this.loewiClient.getClient();
      case 'baroudeur_cycles':
        return this.baroudeurClient.getClient();
      case 'all_cycles':
        return this.allCyclesClient.getClient();
      case 'pilat':
        return this.pilatClient.getClient();
      default:
        throw new Error(
          `No client found for ${
            this.vendorConfigService.getVendorConfig().slug
          }`,
        );
    }
  }
}
