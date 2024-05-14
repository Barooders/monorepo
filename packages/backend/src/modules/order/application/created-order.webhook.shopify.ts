import { routesV1 } from '@config/routes.config';
import { ShopifyBackofficeWebhookGuard } from '@libs/application/decorators/shopify-webhook.guard';
import { Author } from '@libs/domain/types';
import { UUID } from '@libs/domain/value-objects';
import { IPaymentService } from '@modules/buy__payment/domain/ports/payment-service';
import { IPriceOfferService } from '@modules/price-offer/domain/ports/price-offer';
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
    private priceOfferService: IPriceOfferService,
    private paymentService: IPaymentService,
    private orderNotificationService: OrderNotificationService,
  ) {}

  @Post(routesV1.order.onCreatedEvent)
  @UseGuards(ShopifyBackofficeWebhookGuard)
  async handleCreatedOrderEvent(@Body() orderData: IOrder): Promise<void> {
    const author: Author = {
      type: 'shopify',
    };
    const order = await this.orderMapper.mapOrderToStore(orderData);
    const orderId = await this.orderCreationService.storeOrder(order, author);
    const orderUuid = new UUID({ uuid: orderId });

    await this.priceOfferService.updatePriceOfferStatusFromOrder(
      orderData.discount_applications.map((discount) => discount.code),
      author,
    );

    const orderCreated = await this.orderMapper.mapOrderCreated(orderData);
    const checkoutUuid = await this.paymentService.updatePaymentStatusFromOrder(
      order,
      orderData.checkout_token,
      orderCreated.order.paymentMethod,
    );

    await this.paymentService.linkCheckoutToOrder(orderUuid, checkoutUuid);

    await this.orderNotificationService.notifyOrderCreated(orderCreated);
  }
}
