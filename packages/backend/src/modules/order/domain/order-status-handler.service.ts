import envConfig from '@config/env/env.config';
import {
  AggregateName,
  EventName,
  FulfillmentOrderStatus,
  OrderLines,
  OrderStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { ProductUpdateService } from '@modules/product/domain/product-update.service';
import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { ExternalOrderService } from './external-order.service';
import { OrderNotificationService } from './order-notification.service';

enum StockUpdate {
  INCREMENT = 1,
  DECREMENT = -1,
}

@Injectable()
export class OrderStatusHandlerService {
  private readonly logger: Logger = new Logger(OrderStatusHandlerService.name);

  constructor(
    private prisma: PrismaMainClient,
    private productUpdateService: ProductUpdateService,
    private externalOrderService: ExternalOrderService,
    private orderNotificationService: OrderNotificationService,
  ) {}

  async handleNewOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    oldStatus: OrderStatus | null,
    author: Author,
    updatedAt = new Date(),
  ): Promise<void> {
    this.logger.debug(`Order ${orderId} has a new status: ${newStatus}`);

    const { orderLines, customerEmail, name, customer } =
      await this.prisma.order.findUniqueOrThrow({
        where: {
          id: orderId,
        },
        include: {
          orderLines: true,
          customer: true,
        },
      });

    if (newStatus === oldStatus) {
      this.logger.warn(
        `Order received a status update to ${newStatus} but it already has this status, skipping...`,
      );
      return;
    }

    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.ORDER,
        aggregateId: orderId,
        name: EventName.ORDER_UPDATED,
        payload: {
          oldStatus,
          newStatus,
          updatedAt: updatedAt.toISOString(),
        },
        metadata: {
          orderName: name,
          author,
        },
      },
    });

    switch (newStatus) {
      case OrderStatus.CREATED:
        await this.updateStockQuantities(
          orderLines,
          StockUpdate.DECREMENT,
          author,
        );
        break;
      case OrderStatus.PAID:
        await this.prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            paidAt: updatedAt,
          },
        });
        await this.externalOrderService.createExternalOrders({ id: orderId });
        await this.orderNotificationService.notifyOrderPaid(
          new UUID({ uuid: orderId }),
        );
        break;
      case OrderStatus.DELIVERED:
        //TODO: This case should not be handled at order level but at order line level
        await this.prisma.fulfillmentOrder.updateMany({
          where: {
            orderId,
            status: FulfillmentOrderStatus.OPEN,
          },
          data: {
            status: FulfillmentOrderStatus.CLOSED,
          },
        });
        await this.prisma.orderLines.updateMany({
          where: {
            orderId,
          },
          data: {
            deliveredAt: updatedAt,
          },
        });
        await Promise.all(
          orderLines
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            .flatMap(({ vendorId }) => (vendorId ? [vendorId] : []))
            .map(async (vendorId) => {
              await this.prisma.vendorReview.create({
                data: {
                  order: {
                    connect: {
                      id: orderId,
                    },
                  },
                  vendor: {
                    connect: {
                      authUserId: vendorId,
                    },
                  },
                  review: {
                    create: {
                      rating: 5,
                      title: '',
                      content: 'Vente réalisée avec succès',
                      customerId: envConfig.technicalAccountId,
                      orderId,
                      authorNickname: customer?.sellerName ?? 'Anonyme',
                    },
                  },
                },
              });
            }),
        );

        await this.prisma.event.createMany({
          data: orderLines.map(({ id: orderLineId }) => ({
            aggregateName: AggregateName.ORDER,
            aggregateId: orderId,
            name: EventName.ORDER_LINE_RECEIVED,
            payload: { orderLineId },
            metadata: {
              orderName: name,
              author,
            },
          })),
        });
        await this.orderNotificationService.sendAskFeedbackEmail({
          customer: {
            email: customerEmail,
            fullName: [customer?.firstName, customer?.lastName].join(' '),
            id: customer?.authUserId,
          },
          orderName: name,
        });
        break;
      case OrderStatus.CANCELED:
        await this.prisma.orderLines.updateMany({
          where: {
            orderId,
          },
          data: {
            canceledAt: updatedAt,
          },
        });
        await this.prisma.fulfillmentOrder.updateMany({
          where: {
            orderId,
          },
          data: {
            status: FulfillmentOrderStatus.CANCELED,
          },
        });
        await this.prisma.event.createMany({
          data: orderLines.map(({ id: orderLineId }) => ({
            aggregateName: AggregateName.ORDER,
            aggregateId: orderId,
            name: EventName.ORDER_LINE_REFUNDED,
            payload: { orderLineId },
            metadata: {
              orderName: name,
              author,
            },
          })),
        });
        break;
      default:
        this.logger.warn(
          `Order ${orderId} has a new status: ${newStatus} with no action needed.`,
        );
        break;
    }
  }

  private async updateStockQuantities(
    orderLines: OrderLines[],
    action: StockUpdate,
    author: Author,
  ): Promise<void> {
    await Promise.allSettled(
      orderLines.map(async ({ productVariantId, quantity }) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!productVariantId) return;
        try {
          await this.productUpdateService.applyStockUpdateInDatabaseOnly(
            productVariantId,
            action * quantity,
            author,
          );
        } catch (error: any) {
          this.logger.error(error.message, error);
          Sentry.captureException(error);
        }
      }),
    );
  }
}
