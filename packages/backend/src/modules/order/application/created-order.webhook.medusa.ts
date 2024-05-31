import { routesV2 } from '@config/routes.config';
import {
  Condition,
  Currency,
  OrderStatus,
  SalesChannelName,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { LineItem, Order } from '@medusajs/medusa';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderCreationService } from '../domain/order-creation.service';
import { OrderLineToStore, OrderToStore } from '../domain/ports/types';

type OrderData = Pick<
  Order,
  | 'object'
  | 'id'
  | 'created_at'
  | 'updated_at'
  | 'status'
  | 'fulfillment_status'
  | 'payment_status'
  | 'display_id'
  | 'cart_id'
  | 'customer_id'
  | 'email'
  | 'billing_address_id'
  | 'shipping_address_id'
  | 'region_id'
  | 'currency_code'
  | 'tax_rate'
  | 'draft_order_id'
  | 'canceled_at'
  | 'metadata'
  | 'no_notification'
  | 'idempotency_key'
  | 'external_id'
  | 'sales_channel_id'
  | 'discounts'
  | 'fulfillments'
  | 'items'
  | 'payments'
  | 'shipping_address'
>;

@Controller(routesV2.version)
export class CreatedOrderWebhookMedusaController {
  private readonly logger = new Logger(
    CreatedOrderWebhookMedusaController.name,
  );

  constructor(private orderCreationService: OrderCreationService) {}

  @Post(routesV2.order.onCreatedEvent)
  @UseGuards(AuthGuard('header-api-key'))
  async handleCreatedOrderEvent(@Body() orderData: OrderData): Promise<void> {
    this.logger.log(`Received order data: ${jsonStringify(orderData)}`);

    const author: Author = {
      type: 'medusa',
    };

    const orderToStore = this.mapOrderData(orderData);
    await this.orderCreationService.storeOrder(orderToStore, author);
  }

  private mapOrderData(order: OrderData): OrderToStore {
    return {
      order: {
        name: '', // TODO
        shopifyId: undefined, // TODO
        salesChannelName: SalesChannelName.PUBLIC, // TODO
        status: OrderStatus.CREATED, // TODO
        customerEmail: order.email,
        customerId: null, // TODO
        totalPriceInCents: -1, // TODO
        totalPriceCurrency: Currency.EUR,
        shippingAddressAddress1: order.shipping_address.address_1 ?? '',
        shippingAddressAddress2: order.shipping_address.address_2,
        shippingAddressCompany: order.shipping_address.company,
        shippingAddressCity: order.shipping_address.city ?? '',
        shippingAddressPhone: order.shipping_address.phone ?? '',
        shippingAddressCountry: order.shipping_address.country?.name ?? '',
        shippingAddressFirstName: order.shipping_address.first_name ?? '',
        shippingAddressLastName: order.shipping_address.last_name ?? '',
        shippingAddressZip: order.shipping_address.postal_code ?? '',
      },
      orderLines: order.items.map(this.mapOrderItem),
      fulfillmentOrders: [], // TODO
      priceOfferIds: [], // TODO
      payment: {
        checkoutToken: null, // TODO
        methodName: '', // TODO
      },
    };
  }

  private mapOrderItem(lineItem: LineItem): OrderLineToStore {
    return {
      shopifyId: '', // TODO
      name: lineItem.variant.product.title,
      vendorId: lineItem.variant.product.vendor_id,
      priceInCents: lineItem.unit_price,
      buyerCommissionInCents: -1, // TODO
      discountInCents: -1, // TODO
      shippingSolution: ShippingSolution.GEODIS, // TODO
      priceCurrency: Currency.EUR, // TODO
      productType: '', // TODO
      productHandle: lineItem.variant.product.handle ?? '',
      productImage: lineItem.variant.product.thumbnail,
      variantCondition: Condition.AS_NEW, // TODO
      productModelYear: null, // TODO
      productGender: null, // TODO
      productBrand: null, // TODO
      productSize: null, // TODO
      quantity: lineItem.quantity, // TODO
      productVariantId: '', // TODO
      fulfillmentOrder: undefined, // TODO
    };
  }
}
