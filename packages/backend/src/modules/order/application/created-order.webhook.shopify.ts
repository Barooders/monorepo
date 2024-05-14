import { routesV1 } from '@config/routes.config';
import { ShopifyBackofficeWebhookGuard } from '@libs/application/decorators/shopify-webhook.guard';
import { Author } from '@libs/domain/types';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { IOrder } from 'shopify-api-node';
import { OrderCreationService } from '../domain/order-creation.service';
import { OrderNotificationService } from '../domain/order-notification.service';
import { OrderMapper } from '../infrastructure/store/order.mapper';

@Controller(routesV1.version)
export class CreatedOrderWebhookShopifyController {
  constructor(
    private orderMapper: OrderMapper,
    private orderCreationService: OrderCreationService,
    private orderNotificationService: OrderNotificationService,
  ) {}

  @Post(routesV1.order.onCreatedEvent)
  @UseGuards(ShopifyBackofficeWebhookGuard)
  async handleCreatedOrderEvent(@Body() orderData: IOrder): Promise<void> {
    const author: Author = {
      type: 'shopify',
    };
    const order = await this.orderMapper.mapOrderToStore(orderData);
    await this.orderCreationService.storeOrder(order, author);

    const orderCreated = await this.orderMapper.mapOrderCreated(orderData);
    await this.orderNotificationService.notifyOrderCreated(orderCreated);
  }
}
