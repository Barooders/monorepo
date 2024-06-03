import { routesV2 } from '@config/routes.config';
import {
  Currency,
  OrderStatus,
  PrismaMainClient,
  SalesChannelName,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import { getPimDynamicAttribute } from '@libs/infrastructure/strapi/strapi.helper';
import { Discount, Fulfillment, LineItem, Order } from '@medusajs/medusa';
import { StoreId } from '@modules/product/domain/value-objects/store-id.value-object';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import head from 'lodash/head';
import { v4 as uuidv4 } from 'uuid';
import { OrderCreationService } from '../domain/order-creation.service';
import {
  FulfillmentOrderToStore,
  OrderLineToStore,
  OrderToStore,
} from '../domain/ports/types';

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

  constructor(
    private orderCreationService: OrderCreationService,
    private mainPrisma: PrismaMainClient,
  ) {}

  @Post(routesV2.order.onCreatedEvent)
  @UseGuards(AuthGuard('header-api-key'))
  async handleCreatedOrderEvent(@Body() orderData: OrderData): Promise<void> {
    this.logger.log(`Received order data: ${jsonStringify(orderData)}`);

    const author: Author = {
      type: 'medusa',
    };

    const orderToStore = await this.mapOrderData(orderData);
    await this.orderCreationService.storeOrder(orderToStore, author);
  }

  private async mapOrderData(order: OrderData): Promise<OrderToStore> {
    return {
      order: {
        name: '', // TODO
        storeId: new StoreId({ medusaId: order.id }),
        salesChannelName: SalesChannelName.PUBLIC, // TODO
        status: OrderStatus.CREATED,
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
      orderLines: await Promise.all(order.items.map(this.mapOrderItem)),
      fulfillmentOrders: order.fulfillments.map(this.mapFulfillment),
      priceOfferIds: await this.getPriceOffers(order.discounts),
      payment: {
        checkoutToken: null, // TODO
        methodName: '', // TODO
      },
    };
  }

  private async mapOrderItem(lineItem: LineItem): Promise<OrderLineToStore> {
    const { metadata, categories } = lineItem.variant.product;

    const tagsObject = getTagsObject((metadata?.tags as string[]) ?? []);
    const sizeArray = await getPimDynamicAttribute('size', tagsObject);
    const displayedSize = this.getDisplayedSize(sizeArray, lineItem);

    if (lineItem.variant_id == null) {
      throw new Error('Line item does not have a variant id');
    }

    const productVariant =
      await this.mainPrisma.productVariant.findUniqueOrThrow({
        where: {
          medusaId: lineItem.variant_id,
        },
      });

    const productType = categories[0].name;

    return {
      storeId: new StoreId({ medusaId: lineItem.id }),
      name: lineItem.variant.product.title,
      vendorId: lineItem.variant.product.vendor_id,
      priceInCents: lineItem.unit_price,
      buyerCommissionInCents: -1, // TODO
      discountInCents: -1, // TODO
      shippingSolution: ShippingSolution.GEODIS, // TODO
      priceCurrency: Currency.EUR,
      productType,
      productHandle: lineItem.variant.product.handle ?? '',
      productImage: lineItem.variant.product.thumbnail,
      variantCondition: productVariant.condition,
      productModelYear: head(tagsObject['année']),
      productGender: head(tagsObject['genre']),
      productBrand: head(tagsObject['marque']),
      productSize: displayedSize,
      quantity: lineItem.quantity,
      productVariantId: productVariant.id,
      fulfillmentOrder: undefined, // TODO
    };
  }

  // TODO: check if should find correct fulfillment ?
  private mapFulfillment(fulfillment: Fulfillment): FulfillmentOrderToStore {
    return {
      id: uuidv4(),
      storeId: new StoreId({ medusaId: fulfillment.id }),
    };
  }

  private getDisplayedSize(sizeArray: string[] | null, soldProduct: LineItem) {
    if (!sizeArray) return null;

    if (sizeArray.length === 1) return head(sizeArray);

    return sizeArray.find((size) =>
      (
        soldProduct.title ??
        soldProduct.variant.title ??
        soldProduct.variant.product.title
      ).includes(size),
    );
  }

  private async getPriceOffers(
    discounts: Discount[],
  ): Promise<{ id: string }[]> {
    const relatedPriceOffers = await this.mainPrisma.priceOffer.findMany({
      where: {
        discountCode: {
          in: discounts.map((discount) => discount.code),
        },
      },
      select: { id: true },
    });

    return relatedPriceOffers.map(({ id }) => ({ id }));
  }
}
