import {
  AggregateName,
  EventName,
  OrderStatus,
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { IPaymentService } from '@modules/buy__payment/domain/ports/payment-service';
import { IPriceOfferService } from '@modules/price-offer/domain/ports/price-offer';
import { Injectable, Logger } from '@nestjs/common';

import { OrderStatusHandlerService } from './order-status-handler.service';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { OrderToStore } from './ports/types';

export type OrderAdminCreation = {
  salesChannelName: SalesChannelName;
  customerId: string;
  shippingAddress: {
    address1: string;
    address2?: string;
    company?: string;
    phone: string;
    firstName: string;
    lastName: string;
    zip: string;
    city: string;
    country: string;
  };
  lineItems: {
    variantId: string;
    quantity: number;
    unitPriceInCents: number;
    unitBuyerCommission: number;
  }[];
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
      order: { customerId, shopifyId, name },
      priceOffers,
    } = orderToStore;

    try {
      this.logger.debug(
        `Storing order ${shopifyId} for customer ${customerId}`,
      );

      const createdOrderId = await this.storeOrderInDatabase(
        orderToStore,
        author,
      );

      await this.priceOfferService.updatePriceOfferStatusFromOrder(
        priceOffers,
        createdOrderId,
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
        `🚨 La commande ${name} n'a pas été créée en base de données car: ${error.message}`,
      );

      throw error;
    }
  }

  private async storeOrderInDatabase(
    orderToStore: OrderToStore,
    author: Author,
  ): Promise<string> {
    const {
      orderLines,
      fulfillmentOrders,
      order: { shippingAddressPhone, ...order },
    } = orderToStore;

    const existingOrder = await this.prisma.order.findUnique({
      where: {
        shopifyId: order.shopifyId,
      },
    });

    if (existingOrder) {
      this.logger.warn(
        `Order ${order.shopifyId} already exists in database. Skipping creation...`,
      );
      return existingOrder.id;
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
        const { id } = await wrappedPrisma.order.create({
          data: {
            ...order,
            shippingAddressPhone,
            fulfillmentOrders: {
              createMany: {
                data: fulfillmentOrders,
              },
            },
            orderLines: {
              createMany: {
                data: orderLines.map(({ fulfillmentOrder, ...orderLine }) => ({
                  ...orderLine,
                  fulfillmentOrderId: fulfillmentOrder?.id,
                })),
              },
            },
          },
        });

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

    return createdOrderId;
  }
}
