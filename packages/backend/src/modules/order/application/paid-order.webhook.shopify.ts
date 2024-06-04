import { routesV1 } from '@config/routes.config';
import {
  BackOffPolicy,
  Retryable,
} from '@libs/application/decorators/retryable.decorator';
import { ShopifyBackofficeWebhookGuard } from '@libs/application/decorators/shopify-webhook.guard';
import { OrderStatus, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IOrder } from 'shopify-api-node';
import { OrderUpdateService } from '../domain/order-update.service';

@Controller(routesV1.version)
export class PaidOrderWebhookShopifyController {
  private readonly logger = new Logger(PaidOrderWebhookShopifyController.name);

  constructor(
    private prisma: PrismaMainClient,
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
    const orderInternalId = await this.getStoredOrder(orderData.id);

    try {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        orderInternalId,
        OrderStatus.PAID,
        { type: 'shopify' },
      );
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
    const orderInternalId = await this.getStoredOrder(orderShopifyId);

    try {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        orderInternalId,
        OrderStatus.PAID,
        { type: 'admin' },
      );
      this.logger.debug(`Order ${orderInternalId} notified on paid event`);
    } catch (error: any) {
      this.logger.error(
        `Error updated order ${orderInternalId} on paid event: ${error.message}`,
        error,
      );
    }
  }

  private async getStoredOrder(orderShopifyId: number): Promise<string> {
    const storedOrder = await this.prisma.order.findUnique({
      where: { shopifyId: String(orderShopifyId) },
      select: { id: true },
    });

    if (!storedOrder) {
      throw new Error(
        `Cannot save paid event for order ${orderShopifyId} as it does not exist in database`,
      );
    }

    return storedOrder.id;
  }
}
