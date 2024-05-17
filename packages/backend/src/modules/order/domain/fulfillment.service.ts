import {
  AggregateName,
  EventName,
  FulfillmentOrder,
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

    for (const fulfillmentOrder of fulfillmentOrders) {
      await this.fulfillIfShipped(fulfillmentOrder);
    }
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

  async fulfillAsVendor(
    userId: string,
    fulfillmentOrderId: string,
    trackingUrl: string,
  ): Promise<void> {
    const { orderLines } = await this.prisma.fulfillmentOrder.findUniqueOrThrow(
      {
        where: {
          id: fulfillmentOrderId,
        },
        select: {
          orderLines: {
            select: {
              vendorId: true,
            },
          },
        },
      },
    );

    if (orderLines.some(({ vendorId }) => !vendorId)) {
      throw new Error(
        `Cannot fulfill ${fulfillmentOrderId} because at least one orderline has no vendor id`,
      );
    }

    if (orderLines.some(({ vendorId }) => vendorId && vendorId !== userId)) {
      throw new UnauthorizedException(
        `User ${userId} can't fulfill fulfillment order ${fulfillmentOrderId} because it is not the vendor`,
      );
    }

    await this.fulfill(fulfillmentOrderId, trackingUrl, {
      type: 'user',
      id: userId,
    });
  }

  async fulfill(
    fulfillmentOrderId: string,
    trackingUrl: string,
    author: Author,
  ): Promise<void> {
    const fulfillmentOrder =
      await this.prisma.fulfillmentOrder.findUniqueOrThrow({
        where: {
          id: fulfillmentOrderId,
        },
        include: {
          orderLines: true,
        },
      });

    await this.createFulfillment(
      {
        id: fulfillmentOrderId,
        orderId: fulfillmentOrder.orderId,
        orderLines: fulfillmentOrder.orderLines,
      },
      {
        trackingUrl,
      },
      author,
    );
  }

  private async fulfillIfShipped({
    externalOrderId,
    ...fulfillmentOrder
  }: FulfillmentOrder & { orderLines: OrderLines[] }) {
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
      const shippingDetails = await this.orderSyncService.getShippingDetails(
        firstVendorId,
        externalOrderId,
      );

      if (!shippingDetails) {
        this.logger.debug(
          `No shipping details found for external order ${externalOrderId}`,
        );
        return;
      }

      this.logger.debug(
        `Shipping details found for external order ${externalOrderId}`,
        shippingDetails,
      );

      await this.createFulfillment(fulfillmentOrder, shippingDetails, {
        type: 'backend',
      });
    } catch (error: any) {
      this.logger.error(error.message, error);
      Sentry.captureException(error);
    }
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
