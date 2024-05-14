import {
  AggregateName,
  Condition,
  Currency,
  EventName,
  OrderStatus,
  PrismaMainClient,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { IPaymentService } from '@modules/buy__payment/domain/ports/payment-service';
import { IPriceOfferService } from '@modules/price-offer/domain/ports/price-offer';
import { Injectable, Logger } from '@nestjs/common';
import { OrderStatusHandlerService } from './order-status-handler.service';
import { IInternalNotificationClient } from './ports/internal-notification.client';

export type OrderLineToStore = {
  shopifyId: string;
  name: string;
  vendorId: string | undefined;
  priceInCents: number;
  discountInCents: number;
  shippingSolution: ShippingSolution;
  priceCurrency: Currency;
  productType: string;
  productHandle: string;
  productImage: string | null;
  variantCondition?: Condition | null;
  productModelYear?: string | null;
  productGender?: string | null;
  productBrand?: string | null;
  productSize?: string | null;
  quantity: number;
  productVariantId: string | undefined;
  fulfillmentOrderShopifyId: number | undefined;
};

export type FulfillmentOrderToStore = {
  shopifyId: number;
};

export type OrderToStore = {
  shopifyId: string;
  name: string;
  status: OrderStatus;
  customerEmail: string;
  customerId: string | null;
  orderLines: OrderLineToStore[];
  fulfillmentOrders: FulfillmentOrderToStore[];
  totalPriceInCents: number;
  totalPriceCurrency: Currency;
  shippingAddressAddress1: string;
  shippingAddressAddress2: string | null;
  shippingAddressCompany: string | null;
  shippingAddressCity: string;
  shippingAddressPhone: string | null;
  shippingAddressCountry: string;
  shippingAddressFirstName: string;
  shippingAddressLastName: string;
  shippingAddressZip: string;
  usedDiscountCodes: string[];
  payment: {
    methodName: string;
    checkoutToken: string | null;
  };
};

@Injectable()
export class OrderCreationService {
  private readonly logger = new Logger(OrderCreationService.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderStatusHandler: OrderStatusHandlerService,
    private priceOfferService: IPriceOfferService,
    private paymentService: IPaymentService,
    private internalNotificationClient: IInternalNotificationClient,
  ) {}

  async storeOrder(orderToStore: OrderToStore, author: Author): Promise<void> {
    const {
      orderLines,
      fulfillmentOrders,
      shippingAddressPhone,
      usedDiscountCodes,
      ...order
    } = orderToStore;

    try {
      this.logger.debug(
        `Storing order ${order.shopifyId} for customer ${order.customerId}`,
      );

      const existingOrder = await this.prisma.order.findUnique({
        where: {
          shopifyId: order.shopifyId,
        },
      });

      if (existingOrder) {
        this.logger.warn(
          `Order ${order.shopifyId} already exists in database. Skipping...`,
        );
        return;
      }

      if (!shippingAddressPhone) {
        throw new Error(
          `Can't create an order without a phone number: ${order.shopifyId}`,
        );
      }

      const createdOrderId = await this.prisma.$transaction(
        async (wrappedPrisma) => {
          this.logger.warn(
            `Will create order ${
              order.shopifyId
            } with fulfillment orders: ${jsonStringify(fulfillmentOrders)}`,
          );
          const { id, fulfillmentOrders: createdFulfillmentOrders } =
            await wrappedPrisma.order.create({
              data: {
                ...order,
                shippingAddressPhone,
                fulfillmentOrders: {
                  createMany: {
                    data: fulfillmentOrders,
                  },
                },
              },
              include: {
                fulfillmentOrders: true,
              },
            });

          await Promise.all(
            orderLines.map(({ fulfillmentOrderShopifyId, ...orderLine }) => {
              return wrappedPrisma.orderLines.create({
                data: {
                  ...orderLine,
                  orderId: id,
                  fulfillmentOrderId: createdFulfillmentOrders.find(
                    (fo) => Number(fo.shopifyId) === fulfillmentOrderShopifyId,
                  )?.id,
                },
              });
            }),
          );

          await wrappedPrisma.event.create({
            data: {
              aggregateName: AggregateName.ORDER,
              aggregateId: id,
              name: EventName.ORDER_CREATED,
              payload: { order, orderLines },
              metadata: {
                orderName: order.name,
                author,
              },
            },
          });

          return id;
        },
        {
          maxWait: 1_000,
          timeout: 1_000,
        },
      );

      await this.orderStatusHandler.handleNewOrderStatus(
        createdOrderId,
        OrderStatus.CREATED,
        null,
        author,
      );

      await this.priceOfferService.updatePriceOfferStatusFromOrder(
        usedDiscountCodes,
        author,
      );

      const checkoutUuid =
        await this.paymentService.updatePaymentStatusFromOrder(orderToStore);

      await this.paymentService.linkCheckoutToOrder(
        new UUID({ uuid: createdOrderId }),
        checkoutUuid,
      );
    } catch (error: any) {
      await this.internalNotificationClient.sendErrorNotification(
        `🚨 La commande ${order.name} n'a pas été créée en base de données car: ${error.message}`,
      );

      throw error;
    }
  }
}
