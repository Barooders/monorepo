import { routesV1 } from '@config/routes.config';
import {
  BackOffPolicy,
  Retryable,
} from '@libs/application/decorators/retryable.decorator';
import { ShopifyBackofficeWebhookGuard } from '@libs/application/decorators/shopify-webhook.guard';
import {
  Order,
  OrderStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOrder } from 'shopify-api-node';
import { OrderNotificationService } from '../domain/order-notification.service';
import { OrderUpdateService } from '../domain/order-update.service';

@Controller(routesV1.version)
export class PaidOrderWebhookShopifyController {
  private readonly logger = new Logger(PaidOrderWebhookShopifyController.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderNotificationService: OrderNotificationService,
    private orderUpdateService: OrderUpdateService,
  ) {}

  @Post(routesV1.order.onPaidEvent)
  @Retryable({
    backOff: 500,
    maxAttempts: 4,
    exponentialOption: {
      maxInterval: 15000,
      multiplier: 3,
    },
    backOffPolicy: BackOffPolicy.ExponentialBackOffPolicy,
  })
  @UseGuards(ShopifyBackofficeWebhookGuard)
  async handlePaidOrderEvent(@Body() orderData: IOrder): Promise<void> {
    const { id } = await this.getStoredOrder(orderData.id);

    try {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        id,
        OrderStatus.PAID,
        { type: 'shopify' },
      );
      await this.orderNotificationService.notifyOrderPaid(
        new UUID({ uuid: id }),
      );
      this.logger.debug(`Order ${orderData.id} notified on paid event`);
    } catch (error: any) {
      this.logger.error(
        `Error updating order ${orderData.id} on paid event: ${error.message}`,
        error,
      );
    }
  }

  @Post(routesV1.order.onPaidEventAsAdmin)
  @UseGuards(AuthGuard('header-api-key'))
  async handlePaidOrderEventAsAdmin(
    @Body() { orderShopifyId }: { orderShopifyId: number },
  ): Promise<void> {
    const { id } = await this.getStoredOrder(orderShopifyId);

    try {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        id,
        OrderStatus.PAID,
        { type: 'admin' },
      );
      await this.orderNotificationService.notifyOrderPaid(
        new UUID({ uuid: id }),
      );
      this.logger.debug(`Order ${id} notified on paid event`);
    } catch (error: any) {
      this.logger.error(
        `Error updated order ${id} on paid event: ${error.message}`,
        error,
      );
    }
  }

  private async getStoredOrder(orderShopifyId: number): Promise<Order> {
    const storedOrder = await this.prisma.order.findUnique({
      where: { shopifyId: String(orderShopifyId) },
    });

    if (!storedOrder) {
      throw new Error(
        `Cannot save paid event for order ${orderShopifyId} as it does not exist in database`,
      );
    }

    return storedOrder;
  }
}
