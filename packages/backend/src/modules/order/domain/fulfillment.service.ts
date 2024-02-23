import {
  AggregateName,
  EventName,
  FulfillmentOrderStatus,
  FulfillmentStatus,
  OrderLines,
  OrderStatus,
  PrismaMainClient,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { IOrderSyncService } from '@modules/pro-vendor/domain/ports/order-sync.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { first } from 'lodash';
import { OrderUpdateService } from './order-update.service';
import {
  IncorrectStateOrder,
  UserNotConcernedByOrderException,
} from './ports/exceptions';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IShippingClient } from './ports/shipping.client';
import { IStoreClient } from './ports/store.client';
import { TrackingInfo } from './ports/types';

@Injectable()
export class FulfillmentService {
  private readonly logger = new Logger(FulfillmentService.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderSyncService: IOrderSyncService,
    private storeClient: IStoreClient,
    private shippingService: IShippingClient,
    private orderUpdateService: OrderUpdateService,
    private internalNotificationClient: IInternalNotificationClient,
  ) {}

  async checkFulfillmentStatus(): Promise<void> {
    const fulfillmentOrders = await this.prisma.fulfillmentOrder.findMany({
      where: {
        externalOrderId: {
          not: null,
        },
        status: FulfillmentOrderStatus.OPEN,
      },
      include: {
        orderLines: true,
      },
    });

    await Promise.allSettled(
      fulfillmentOrders.map(
        async ({ externalOrderId, ...fulfillmentOrder }) => {
          try {
            this.logger.debug(`Fulfilling external order ${externalOrderId}`);

            if (!externalOrderId) {
              this.logger.debug(
                `No external order id found for fulfillment order ${fulfillmentOrder.id}`,
              );
              return;
            }

            const firstVendorId = first(fulfillmentOrder.orderLines)?.vendorId;

            if (!firstVendorId) {
              throw new Error(
                `No vendor id found in first order line of fulfillment order ${fulfillmentOrder.id}`,
              );
            }

            //TODO: order-sync service should return shipping details and variants+quantities that have been shipped
            const shippingDetails =
              await this.orderSyncService.getShippingDetails(
                firstVendorId,
                externalOrderId,
              );

            if (!shippingDetails) {
              this.logger.debug(
                `No shipping details found for external order ${externalOrderId}`,
              );
              return;
            }

            await this.createFulfillment(fulfillmentOrder, shippingDetails, {
              type: 'backend',
            });
          } catch (error: any) {
            this.logger.error(error.message, error);
            Sentry.captureException(error);
          }
        },
      ),
    );
  }

  async getOrCreateShippingLabel(orderId: UUID, userId: UUID): Promise<Buffer> {
    const order = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId.uuid },
      include: { orderLines: true },
    });

    const orderLine = order.orderLines.find(
      (orderLine) => orderLine.vendorId === userId.uuid,
    );

    if (!orderLine) {
      throw new UserNotConcernedByOrderException(order.id, userId.uuid);
    }

    if (
      !(
        orderLine.shippingSolution === ShippingSolution.SENDCLOUD &&
        (order.status === OrderStatus.LABELED ||
          order.status === OrderStatus.PAID)
      )
    ) {
      throw new IncorrectStateOrder(order.id, {
        status: order.status,
        shippingSolution: orderLine.shippingSolution,
      });
    }

    try {
      const shippingLabelStream =
        await this.shippingService.getOrcreateShippingLabelStreamFromOrderName(
          order.name,
        );

      return shippingLabelStream;
    } catch (e) {
      await this.internalNotificationClient.sendErrorNotification(
        `🚨 Impossible de générer le bordereau pour la commande ${order.name}, aller sur <https://app.sendcloud.com/v2/shipping/list/orders|SendCloud>`,
      );
      throw e;
    }
  }

  async fulfillOrderLineAsVendor(
    userId: string,
    orderLineId: string,
    trackingUrl: string,
  ): Promise<void> {
    const { vendorId } = await this.prisma.orderLines.findUniqueOrThrow({
      where: {
        id: orderLineId,
      },
    });

    if (!vendorId) {
      throw new Error(
        `Cannot fulfill order line ${orderLineId} because it has no vendor id`,
      );
    }

    if (vendorId !== userId) {
      throw new UnauthorizedException(
        `User ${userId} can't fulfill orderline ${orderLineId} because it is not the vendor`,
      );
    }

    await this.fulfillOrderLine(orderLineId, trackingUrl, {
      type: 'user',
      id: userId,
    });
  }

  async fulfillOrderLine(
    orderLineId: string,
    trackingUrl: string,
    author: Author,
  ): Promise<void> {
    const orderLine = await this.prisma.orderLines.findUniqueOrThrow({
      where: {
        id: orderLineId,
      },
      include: {
        fulfillmentOrder: {
          include: {
            orderLines: true,
          },
        },
        order: true,
      },
    });

    if (orderLine.fulfillmentOrderId && orderLine.fulfillmentOrder) {
      await this.createFulfillment(
        {
          id: orderLine.fulfillmentOrderId,
          orderId: orderLine.orderId,
          orderLines: orderLine.fulfillmentOrder.orderLines,
        },
        {
          trackingUrl,
        },
        author,
      );
      return;
    }

    this.logger.warn(
      `Creating fulfillment order for order line ${orderLine.id}`,
    );

    const fulfillmentOrderShopifyId =
      await this.storeClient.getFulfillmentOrderId(
        orderLine.order.shopifyId,
        orderLine.shopifyId,
      );

    if (!fulfillmentOrderShopifyId) {
      throw new Error(
        `No fulfillment order found for order line ${orderLine.id}`,
      );
    }

    const createdFulfillmentOrder = await this.prisma.fulfillmentOrder.create({
      data: {
        shopifyId: fulfillmentOrderShopifyId,
        status: FulfillmentOrderStatus.OPEN,
        order: {
          connect: {
            id: orderLine.orderId,
          },
        },
        orderLines: {
          connect: {
            id: orderLine.id,
          },
        },
      },
    });

    await this.createFulfillment(
      {
        id: createdFulfillmentOrder.id,
        orderId: orderLine.orderId,
        orderLines: [orderLine],
      },
      {
        trackingUrl,
      },
      author,
    );
  }

  private async createFulfillment(
    {
      id,
      orderId,
      orderLines,
    }: { id: string; orderId: string; orderLines: OrderLines[] },
    trackingInfo: TrackingInfo,
    author: Author,
  ) {
    //TODO: this should only be done when all FulfillmentItems are fulfilled
    await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
      orderId,
      OrderStatus.SHIPPED,
      author,
      new Date(),
      async () => {
        const { fulfilledItems, shopifyId } =
          await this.storeClient.fulfillFulfillmentOrder(id, trackingInfo);

        await this.prisma.$transaction(async (wrappedPrisma) => {
          await wrappedPrisma.fulfillment.create({
            data: {
              shopifyId,
              fulfillmentOrderId: id,
              status: FulfillmentStatus.SUCCESS,
              trackingId: trackingInfo.trackingId,
              trackingUrl: trackingInfo.trackingUrl,
              fulfillmentItems: {
                createMany: {
                  data: orderLines.map(
                    ({ productVariantId, quantity, id: orderLineId }) => {
                      if (!productVariantId) {
                        throw new Error(
                          `No product variant id found on order line ${orderLineId} when try to fulfill FulfillOrder ${id}`,
                        );
                      }

                      const storeId = fulfilledItems.find(
                        (item) => item.productVariantId === productVariantId,
                      )?.fulfillmentItemShopifyId;

                      if (!storeId) {
                        throw new Error(
                          `Product variant ${productVariantId} not found in store fulfillment ${shopifyId}`,
                        );
                      }

                      return {
                        shopifyId: storeId,
                        productVariantId,
                        quantity,
                      };
                    },
                  ),
                },
              },
            },
          });

          await wrappedPrisma.fulfillmentOrder.update({
            where: {
              id,
            },
            data: {
              status: FulfillmentOrderStatus.CLOSED,
            },
          });

          await wrappedPrisma.event.create({
            data: {
              aggregateName: AggregateName.ORDER,
              aggregateId: orderId,
              name: EventName.ORDER_LINE_SHIPPED,
              payload: {
                orderLines: orderLines.map(
                  ({ id: orderLineId }) => orderLineId,
                ),
              },
              metadata: { author },
            },
          });
        });

        this.logger.warn(`Fulfillment order ${id} fulfilled`);
      },
    );
  }
}
