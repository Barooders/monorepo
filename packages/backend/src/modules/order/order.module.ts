import { CustomerRepository } from '@libs/domain/customer.repository';
import { MutexModule } from '@libs/domain/mutex.module';
import { PrismaModule } from '@libs/domain/prisma.module';
import { PostgreSQLSessionStorage } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/postgresql-session-storage.lib';
import { SessionMapper } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/session.mapper';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import { PaymentModule } from '@modules/buy__payment/module';
import { CustomerModule } from '@modules/customer/customer.module';
import { BuyerCommissionController } from '@modules/order/application/buyer-commission.web';
import { HandDeliveryOrderController } from '@modules/order/application/hand-delivery-order.web';
import { PayoutController } from '@modules/order/application/payout.web';
import { BuyerCommissionService } from '@modules/order/domain/buyer-commission.service';
import { CommissionService } from '@modules/order/domain/commission.service';
import { HandDeliveryService } from '@modules/order/domain/hand-delivery.service';
import { OrderCreationService } from '@modules/order/domain/order-creation.service';
import { OrderNotificationService } from '@modules/order/domain/order-notification.service';
import { OrderValidationService } from '@modules/order/domain/order-validation.service';
import { PayoutService } from '@modules/order/domain/payout.service';
import { IEmailClient } from '@modules/order/domain/ports/email.client';
import { IInternalNotificationClient } from '@modules/order/domain/ports/internal-notification.client';
import { IPaymentProvider } from '@modules/order/domain/ports/payment-provider';
import { IStoreClient } from '@modules/order/domain/ports/store.client';
import { ISupportCenterClient } from '@modules/order/domain/ports/support-center.client';
import { SendGridClient } from '@modules/order/infrastructure/email/sendgrid.client';
import { SlackClient } from '@modules/order/infrastructure/internal-notification/slack.client';
import { StripeClient } from '@modules/order/infrastructure/payment-provider/stripe.client';
import { OrderMapper } from '@modules/order/infrastructure/store/order.mapper';
import { ShopifyClient } from '@modules/order/infrastructure/store/shopify.client';
import { GorgiasClient } from '@modules/order/infrastructure/support-center/gorgias.client';
import { PriceOfferModule } from '@modules/price-offer/price-offer.module';
import { ProVendorConsoleModule } from '@modules/pro-vendor/console.module';
import { ProductModule } from '@modules/product/product.module';
import { Module } from '@nestjs/common';
import { CommissionCLIConsole } from './application/commission.cli';
import { CreatedOrderWebhookShopifyController } from './application/created-order.webhook.shopify';
import { OrderCLIConsole } from './application/order.cli';
import { OrderController } from './application/order.web';
import { OrderWebhookSendCloudController } from './application/order.webhook.send-cloud';
import { PaidOrderWebhookShopifyController } from './application/paid-order.webhook.shopify';
import { ExternalOrderService } from './domain/external-order.service';
import { FulfillmentService } from './domain/fulfillment.service';
import { OrderStatusHandlerService } from './domain/order-status-handler.service';
import { OrderUpdateService } from './domain/order-update.service';
import { OrderService } from './domain/order.service';
import { IShippingClient } from './domain/ports/shipping.client';
import { RefundService } from './domain/refund.service';
import { SendCloudClient } from './infrastructure/shipping/send-cloud.client';
import { ChatModule } from '@modules/chat/chat.module';

const commonProviders = [
  CustomerRepository,
  OrderMapper,
  {
    provide: IEmailClient,
    useClass: SendGridClient,
  },
  {
    provide: IInternalNotificationClient,
    useClass: SlackClient,
  },
  {
    provide: IStoreClient,
    useClass: ShopifyClient,
  },
  HandDeliveryService,
  FulfillmentService,
  RefundService,
  ExternalOrderService,
  OrderCreationService,
  OrderUpdateService,
  OrderService,
  OrderNotificationService,
  OrderStatusHandlerService,
  {
    provide: ISupportCenterClient,
    useClass: GorgiasClient,
  },
  {
    provide: IShippingClient,
    useClass: SendCloudClient,
  },
  {
    provide: IPaymentProvider,
    useClass: StripeClient,
  },
  BuyerCommissionService,
  PayoutService,
  CommissionService,
  OrderValidationService,
  ShopifyApiBySession,
  SessionMapper,
  PostgreSQLSessionStorage,
];

const commonImports = [
  MutexModule,
  ProductModule,
  ProVendorConsoleModule,
  PrismaModule,
  CustomerModule,
  PriceOfferModule,
  PaymentModule,
  ChatModule,
];

@Module({
  imports: commonImports,
  controllers: [
    PaidOrderWebhookShopifyController,
    CreatedOrderWebhookShopifyController,
    OrderWebhookSendCloudController,
    HandDeliveryOrderController,
    OrderController,
    BuyerCommissionController,
    PayoutController,
  ],
  providers: commonProviders,
})
export class OrderModule {}

@Module({
  imports: commonImports,
  controllers: [],
  providers: [...commonProviders, OrderCLIConsole, CommissionCLIConsole],
})
export class OrderConsoleModule {}
