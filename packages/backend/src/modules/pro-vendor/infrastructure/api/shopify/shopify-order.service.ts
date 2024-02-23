import { OrderSyncServiceStrategy } from '@modules/pro-vendor/domain/ports/order-sync-service.strategy';
import {
  OrderVendorInput,
  ShippingDetails,
} from '@modules/pro-vendor/domain/ports/types';
import { Injectable, Logger } from '@nestjs/common';
import { head } from 'lodash';

import { ShopifyClient } from './shopify.client';

@Injectable()
export class ShopifyOrderService implements OrderSyncServiceStrategy {
  private readonly logger = new Logger(ShopifyOrderService.name);

  constructor(private shopifyClient: ShopifyClient) {}

  async createOrder({
    customer,
    products,
    order,
  }: OrderVendorInput): Promise<string> {
    this.logger.debug(`Creating shopify order`);
    const { id } = await this.shopifyClient.createOrder({
      order,
      lineItems: products.map(({ externalVariantId, quantity }) => ({
        variantShopifyId: Number(externalVariantId),
        quantity: quantity,
      })),
      customer: {
        shippingAddress: {
          firstName: customer.firstName,
          lastName: customer.lastName,
          address1: customer.address1,
          address2: customer.address2,
          phone: customer.phone,
          city: customer.city,
          country: customer.country,
          zip: customer.zipCode,
        },
        obfuscatedEmail: customer.obfuscatedEmail,
        realEmail: customer.realEmail,
      },
    });

    return String(id);
  }

  async getShippingDetails(
    externalOrderId: string,
  ): Promise<ShippingDetails | null> {
    const fulfillments = await this.shopifyClient.getOrderFulfillments(
      Number(externalOrderId),
    );

    const trackingInfo = fulfillments.find(
      ({ tracking_url }) => !!tracking_url,
    );

    if (!trackingInfo) {
      return null;
    }

    return {
      trackingId: head(trackingInfo.tracking_numbers),
      trackingUrl: trackingInfo.tracking_url,
    };
  }
}
