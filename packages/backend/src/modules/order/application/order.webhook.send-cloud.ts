import { routesV1 } from '@config/routes.config';
import { SendCloudWebhookGuard } from '@libs/application/decorators/send-cloud-webhook.guard';
import { InternalServerErrorException } from '@libs/domain/exceptions';
import { OrderStatus, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { first } from 'lodash';
import { PRODUCT_TYPE } from '../domain/constants/commission-product.constants';
import { FulfillmentService } from '../domain/fulfillment.service';
import { OrderUpdateService } from '../domain/order-update.service';
import { OrderStatusUpdateNotAllowed } from '../domain/ports/exceptions';
import { mapOrderStatus } from '../infrastructure/shipping/config';
import { SendCloudWebhookEvent } from '../infrastructure/shipping/types';

@Controller(routesV1.version)
export class OrderWebhookSendCloudController {
  private readonly logger = new Logger(OrderWebhookSendCloudController.name);
  constructor(
    private orderUpdateService: OrderUpdateService,
    private fulfillmentService: FulfillmentService,
    private prisma: PrismaMainClient,
  ) {}

  @Post(routesV1.order.updateOnOrderStatusEvent)
  @UseGuards(SendCloudWebhookGuard)
  async notifyOnParcelUpdate(
    @Body() eventPayload: SendCloudWebhookEvent,
  ): Promise<void> {
    if (eventPayload.action !== 'parcel_status_changed') {
      this.logger.warn(`Unknown action: ${eventPayload.action}`);
      return;
    }

    const {
      order_number: orderNumber,
      status: { id: statusId },
      tracking_url: trackingUrl,
    } = eventPayload.parcel;

    const newOrderStatus = mapOrderStatus(statusId);

    if (!newOrderStatus) {
      this.logger.warn(
        `Unknown status id: ${statusId} for order ${orderNumber}, tracking url: ${trackingUrl}`,
      );
      return;
    }

    const { id: orderId, orderLines } =
      await this.prisma.order.findFirstOrThrow({
        where: { name: orderNumber },
        select: {
          id: true,
          orderLines: {
            where: { productType: { not: PRODUCT_TYPE } },
            select: { id: true },
          },
        },
      });

    const productOrderLine = first(orderLines)?.id;

    try {
      if (newOrderStatus === OrderStatus.SHIPPED) {
        if (!productOrderLine) {
          throw new InternalServerErrorException(
            `Cannot find orderline for order ${orderNumber}`,
          );
        }
        await this.fulfillmentService.fulfillOrderLine(
          productOrderLine,
          trackingUrl,
          { type: 'send_cloud' },
        );
        return;
      }

      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        orderId,
        newOrderStatus,
        { type: 'send_cloud' },
      );
    } catch (error: any) {
      if (error instanceof OrderStatusUpdateNotAllowed) {
        this.logger.warn(
          `Skipping Sendcloud webhook because: ${error.message}`,
          error,
        );
        return;
      }
    }
  }
}
