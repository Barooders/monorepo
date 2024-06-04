import { routesV2 } from '@config/routes.config';
import {
  BackOffPolicy,
  Retryable,
} from '@libs/application/decorators/retryable.decorator';
import { OrderStatus, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Order } from '@medusajs/medusa';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrderUpdateService } from '../domain/order-update.service';

type OrderData = Pick<Order, 'id'>;

@Controller(routesV2.version)
export class PaidOrderWebhookMedusaController {
  private readonly logger = new Logger(PaidOrderWebhookMedusaController.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderUpdateService: OrderUpdateService,
  ) {}

  @Post(routesV2.order.onPaidEvent)
  @Retryable({
    backOff: 500,
    maxAttempts: 4,
    exponentialOption: {
      maxInterval: 15000,
      multiplier: 3,
    },
    backOffPolicy: BackOffPolicy.ExponentialBackOffPolicy,
  })
  @UseGuards(AuthGuard('header-api-key'))
  async handlePaidOrderEvent(@Body() orderData: OrderData): Promise<void> {
    const id = await this.getStoredOrder(orderData.id);

    try {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        id,
        OrderStatus.PAID,
        { type: 'medusa' },
      );
    } catch (error: any) {
      this.logger.error(
        `Error updating order ${orderData.id} on paid event: ${error.message}`,
        error,
      );
    }
  }

  private async getStoredOrder(orderMedusaId: string): Promise<string> {
    const storedOrder = await this.prisma.order.findUnique({
      where: { medusaId: orderMedusaId },
      select: { id: true },
    });

    if (!storedOrder) {
      throw new Error(
        `Cannot save paid event for order ${orderMedusaId} as it does not exist in database`,
      );
    }

    return storedOrder.id;
  }
}
