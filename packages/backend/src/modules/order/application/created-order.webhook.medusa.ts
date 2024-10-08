import envConfig from '@config/env/env.config';
import { routesV2 } from '@config/routes.config';
import { COMMISSION_NAME } from '@libs/domain/constants/commission-product.constants';
import { getOrderShippingSolution } from '@libs/domain/order.interface';
import {
  Condition,
  Currency,
  OrderStatus,
  PaymentSolutionCode,
  PrismaMainClient,
  SalesChannelName,
  ShippingSolution,
  ShippingType,
} from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { Author, BIKES_COLLECTION_HANDLE } from '@libs/domain/types';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import { getPimDynamicAttribute } from '@libs/infrastructure/strapi/strapi.helper';
import {
  Discount,
  Fulfillment,
  LineItem,
  Order,
  Payment,
} from '@medusajs/medusa';
import { StoreId } from '@modules/product/domain/value-objects/store-id.value-object';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { first, last } from 'lodash';
import head from 'lodash/head';
import { v4 as uuidv4 } from 'uuid';
import { OrderCreationService } from '../domain/order-creation.service';
import { OrderNotificationService } from '../domain/order-notification.service';
import {
  FulfillmentOrderToStore,
  OrderCreatedData,
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
type MedusaLineItem = Omit<
  LineItem,
  'beforeInsert' | 'beforeUpdate' | 'afterUpdateOrLoad'
>;

@Controller(routesV2.version)
export class CreatedOrderWebhookMedusaController {
  private readonly logger = new Logger(
    CreatedOrderWebhookMedusaController.name,
  );

  constructor(
    private orderCreationService: OrderCreationService,
    private orderNotificationService: OrderNotificationService,
    private storePrisma: PrismaStoreClient,
    private mainPrisma: PrismaMainClient,
  ) {}

  @Post(routesV2.order.onCreatedEvent)
  @UseGuards(AuthGuard('header-api-key'))
  async handleCreatedOrderEvent(@Body() orderData: OrderData): Promise<void> {
    this.logger.log(`Received order data for order ${orderData.id}`);

    const author: Author = {
      type: 'medusa',
    };

    const orderToStore = await this.mapOrderToStore(orderData);
    await this.orderCreationService.storeOrder(orderToStore, author);

    const orderCreated = await this.mapOrderCreated(orderData);
    await this.orderNotificationService.notifyOrderCreated(orderCreated);
  }

  private async mapOrderToStore(order: OrderData): Promise<OrderToStore> {
    const fulfillmentOrders = order.fulfillments.map(this.mapFulfillment);

    const buyerCustomer = await this.mainPrisma.users.findUnique({
      where: {
        email: order.email,
      },
      select: {
        id: true,
      },
    });

    const totalPriceInCents = this.getTotalOrderPriceInCents(order);

    const orderItemsWithInternalVariant =
      await this.getEnrichedOrderItems(order);
    const internalVariantIds = orderItemsWithInternalVariant.map(
      (item) => item.internalProductVariant.id,
    );
    const hasBikesInOrder =
      await this.hasBikeInVariantsArray(internalVariantIds);

    return {
      order: {
        name: `#${order.display_id}`,
        storeId: new StoreId({ medusaId: order.id }),
        salesChannelName: SalesChannelName.PUBLIC,
        status: OrderStatus.CREATED,
        customerEmail: order.email,
        customerId: buyerCustomer?.id ?? null,
        totalPriceInCents: totalPriceInCents,
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
      orderLines: await Promise.all(
        orderItemsWithInternalVariant.map((item) =>
          this.mapOrderItem(item, fulfillmentOrders, hasBikesInOrder),
        ),
      ),
      fulfillmentOrders: fulfillmentOrders,
      priceOfferIds: await this.getPriceOffers(order.discounts),
    };
  }

  private async mapOrderCreated(order: OrderData): Promise<OrderCreatedData> {
    const productLineItem = order.items.find(
      (item) => item.title !== COMMISSION_NAME,
    );

    if (!productLineItem) {
      throw new Error(`No product found in order ${order.id}`);
    }

    return {
      customer: {
        email: order.email,
        firstName: '',
        fullName: '',
      },
      order: {
        adminUrl: `${envConfig.externalServices.medusa.baseUrl}/app/a/orders/${order.id}`,
        name: `#${order.display_id}`,
        paymentMethod: first(order.payments)?.provider_id ?? '',
        totalPrice: (this.getTotalOrderPriceInCents(order) / 100).toFixed(2),
      },
      product: {
        createdAt: productLineItem.created_at,
        name: productLineItem.title,
        referenceUrl: '',
      },
    };
  }

  private getTotalOrderPriceInCents(order: OrderData) {
    return order.items.reduce(
      (acc, item) => acc + item.unit_price * item.quantity,
      0,
    );
  }

  private async getEnrichedOrderItems(order: OrderData) {
    const orderItemIsCommission = (item: LineItem) =>
      item.title === COMMISSION_NAME;

    //TODO: Handle multiple order items, managing commission at order line level
    // instead of adding a new order line
    const commissionItem = order.items.find(orderItemIsCommission);
    const mainOrderItem = order.items.find(
      (item) => !orderItemIsCommission(item),
    );

    if (!mainOrderItem) {
      throw new Error('Order does not have any line items');
    }

    const medusaVariantId = mainOrderItem.variant_id;
    if (medusaVariantId == null) {
      throw new Error('Line item does not have a variant id');
    }

    const productVariant =
      await this.mainPrisma.productVariant.findUniqueOrThrow({
        where: {
          medusaId: medusaVariantId,
        },
      });

    return [
      {
        ...mainOrderItem,
        internalProductVariant: {
          id: productVariant.id,
          condition: productVariant.condition,
        },
        buyerCommissionInCents: commissionItem?.unit_price ?? 0,
      },
    ];
  }

  private async mapOrderItem(
    lineItem: MedusaLineItem & {
      internalProductVariant: { id: string; condition: Condition | null };
      buyerCommissionInCents: number;
    },
    fulfillmentOrders: (FulfillmentOrderToStore & {
      variantIds: { variantId: string | null }[];
    })[],
    hasBikesInOrder: boolean,
  ): Promise<OrderLineToStore> {
    const { metadata, categories } = lineItem.variant.product;

    const tagsObject = getTagsObject((metadata?.tags as string[]) ?? []);
    const sizeArray = await getPimDynamicAttribute('size', tagsObject);
    const displayedSize = this.getDisplayedSize(sizeArray, lineItem);

    const productType = categories[0].name;

    const { authUserId: vendorId, usedShipping } =
      await this.mainPrisma.customer.findUniqueOrThrow({
        where: {
          authUserId: lineItem.variant.product.vendor_id,
        },
        select: {
          authUserId: true,
          usedShipping: true,
        },
      });

    return {
      storeId: new StoreId({ medusaId: lineItem.id }),
      name: lineItem.variant.product.title,
      vendorId,
      priceInCents: lineItem.unit_price,
      buyerCommissionInCents: lineItem.buyerCommissionInCents,
      discountInCents: lineItem.discount_total ?? 0,
      shippingSolution: await this.getOrderShippingSolution(
        hasBikesInOrder,
        usedShipping,
      ),
      priceCurrency: Currency.EUR,
      productType,
      productHandle: lineItem.variant.product.handle ?? '',
      productImage: lineItem.variant.product.thumbnail,
      variantCondition: lineItem.internalProductVariant.condition,
      productModelYear: head(tagsObject['année']),
      productGender: head(tagsObject['genre']),
      productBrand: head(tagsObject['marque']),
      productSize: displayedSize,
      quantity: lineItem.quantity,
      productVariantId: lineItem.internalProductVariant.id,
      fulfillmentOrder: fulfillmentOrders.find((fulfillmentOrder) =>
        fulfillmentOrder.variantIds.find(
          ({ variantId: fulfillmentVariantId }) =>
            fulfillmentVariantId === lineItem.variant_id,
        ),
      ),
    };
  }

  private mapFulfillment(
    fulfillment: Fulfillment,
  ): FulfillmentOrderToStore & { variantIds: { variantId: string | null }[] } {
    return {
      id: uuidv4(),
      storeId: new StoreId({ medusaId: fulfillment.id }),
      variantIds: fulfillment.items.map((item) => ({
        variantId: item.item.variant_id,
      })),
    };
  }

  private getDisplayedSize(
    sizeArray: string[] | null,
    soldProduct: MedusaLineItem,
  ) {
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

  private getPaymentMethodName(payments: Payment[]): PaymentSolutionCode {
    const payment = last(payments);

    if (!payment) {
      throw new Error('Order does not have any payments');
    }

    switch (payment.provider_id) {
      case 'stripe':
        return PaymentSolutionCode.CREDIT_CARD;
      case 'paypal':
        return PaymentSolutionCode.PAYPAL;
      case 'manual':
        return PaymentSolutionCode.BANK_WIRE;
      default:
        throw new Error(`Unknown payment provider: ${payment.provider_id}`);
    }
  }

  private async getOrderShippingSolution(
    hasBikesInOrder: boolean,
    vendorUsedShipping?: ShippingType,
  ): Promise<ShippingSolution> {
    const isHandDelivery = false;
    return await getOrderShippingSolution(
      isHandDelivery,
      hasBikesInOrder,
      vendorUsedShipping,
    );
  }

  private async hasBikeInVariantsArray(
    variantInternalIds: string[],
  ): Promise<boolean> {
    const bikesCount = await this.storePrisma.storeBaseProductVariant.count({
      where: {
        id: {
          in: variantInternalIds,
        },
        product: {
          collections: {
            some: {
              collection: {
                handle: BIKES_COLLECTION_HANDLE,
              },
            },
          },
        },
      },
    });

    return bikesCount > 0;
  }
}
