import {
  AggregateName,
  EventName,
  OrderStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import { OrderMapper } from '../infrastructure/store/order.mapper';
import { OrderStatusHandlerService } from './order-status-handler.service';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { Order } from './ports/types';

@Injectable()
export class OrderCreationService {
  private readonly logger = new Logger(OrderCreationService.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderMapper: OrderMapper,
    private orderStatusHandler: OrderStatusHandlerService,
    private internalNotificationClient: IInternalNotificationClient,
  ) {}

  async createOrder(order: Order, author: Author): Promise<string> {
    try {
      this.logger.debug(
        `Storing order ${order.storeId.id} for customer ${order.customer!.id?.uuid}`,
      );

      const existingOrder = await this.prisma.order.findUnique({
        where: {
          shopifyId: order.storeId.id.toString(),
        },
      });

      if (existingOrder) {
        this.logger.warn(
          `Order ${order.storeId.id} already exists in database. Skipping...`,
        );
        return existingOrder.id;
      }

      if (!order.shippingAddress?.phone) {
        throw new Error(
          `Can't create an order without a phone number: ${order.storeId.id}`,
        );
      }

      const createdOrderId = await this.prisma.$transaction(
        async (wrappedPrisma) => {
          this.logger.warn(
            `Will create order ${
              order.storeId.id
            } with fulfillment orders: ${jsonStringify(order.fulfillmentOrders)}`,
          );
          const { id, fulfillmentOrders: createdFulfillmentOrders } =
            await wrappedPrisma.order.create({
              data: {
                ...this.orderMapper.toPersistence(order),
                fulfillmentOrders: {
                  createMany: {
                    data: order.fulfillmentOrders ?? [],
                  },
                },
              },
              include: {
                fulfillmentOrders: true,
              },
            });

          await Promise.all(
            order.orderLines.map(
              ({ fulfillmentOrderShopifyId, ...orderLine }) => {
                return wrappedPrisma.orderLines.create({
                  data: {
                    orderId: id,
                    fulfillmentOrderId: createdFulfillmentOrders.find(
                      (fo) =>
                        Number(fo.shopifyId) === fulfillmentOrderShopifyId,
                    )?.id,
                  },
                });
              },
            ),
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

      return createdOrderId;
    } catch (error: any) {
      await this.internalNotificationClient.sendErrorNotification(
        `🚨 La commande ${order.name} n'a pas été créée en base de données car: ${error.message}`,
      );

      throw error;
    }
  }
}
