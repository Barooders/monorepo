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
import { shopifyApiByToken } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOrder } from 'shopify-api-node';
import { OrderNotificationService } from '../domain/order-notification.service';
import { OrderUpdateService } from '../domain/order-update.service';
import { OrderMapper } from '../infrastructure/store/order.mapper';

const TEN_MINUTES = 10 * 60 * 1000;

@Controller(routesV1.version)
export class PaidOrderWebhookShopifyController {
  private readonly logger = new Logger(PaidOrderWebhookShopifyController.name);

  constructor(
    private orderMapper: OrderMapper,
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
    const order = await this.orderMapper.mapOrderPaid(orderData);

    const { id } = await this.getStoredOrder(orderData);

    try {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        id,
        OrderStatus.PAID,
        { type: 'shopify' },
      );
      await this.orderNotificationService.notifyOrderPaid(order);
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
    const orderData = await shopifyApiByToken.order.get(orderShopifyId);
    const order = await this.orderMapper.mapOrderPaid(orderData);

    const { id } = await this.getStoredOrder(orderData);

    try {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        id,
        OrderStatus.PAID,
        { type: 'admin' },
      );
      await this.orderNotificationService.notifyOrderPaid(order);
      this.logger.debug(`Order ${orderData.id} notified on paid event`);
    } catch (error: any) {
      this.logger.error(
        `Error updated order ${orderData.id} on paid event: ${error.message}`,
        error,
      );
    }
  }

  private async getStoredOrder({ id, created_at }: IOrder): Promise<Order> {
    const storedOrder = await this.prisma.order.findUnique({
      where: { shopifyId: String(id) },
    });

    const secondsSinceCreation =
      (new Date().getTime() - new Date(created_at).getTime()) / 1000;

    if (!storedOrder && secondsSinceCreation < TEN_MINUTES) {
      throw new Error(
        `Order ${id} was created less than 10 minutes ago and is not saved in database yet`,
      );
    }

    if (!storedOrder) {
      throw new Error(
        `Cannot save paid event for order ${id} as it does not exist in database`,
      );
    }

    return storedOrder;
  }
}
