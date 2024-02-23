import { PrismaModule } from '@libs/domain/prisma.module';
import { ConfigStoreService } from '@libs/infrastructure/config-store/config-store.service';
import { Module } from '@nestjs/common';
import { PaymentWebController } from './application/payment.web';
import { PaymentFloaWebhookController } from './application/payment.webhook.floa';
import { PaymentService } from './domain/payment.service';
import { IPaymentProvider } from './domain/ports/payment-provider.repository';
import { FloaPaymentProvider } from './infrastructure/payment-provider/floa';
import { IStore } from './domain/ports/store.repository';
import { ShopifyStore } from './infrastructure/store/shopify';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import { PostgreSQLSessionStorage } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/postgresql-session-storage.lib';
import { SessionMapper } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/session.mapper';
import { IInternalNotificationProvider } from './domain/ports/internal-notification.repository';
import { SlackClient } from './infrastructure/internal-notification/slack.client';
import { IPaymentService } from './domain/ports/payment-service';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentWebController, PaymentFloaWebhookController],
  providers: [
    ConfigStoreService,
    PaymentService,
    ShopifyApiBySession,
    PostgreSQLSessionStorage,
    SessionMapper,
    {
      provide: IPaymentProvider,
      useClass: FloaPaymentProvider,
    },
    {
      provide: IStore,
      useClass: ShopifyStore,
    },
    {
      provide: IInternalNotificationProvider,
      useClass: SlackClient,
    },
    {
      provide: IPaymentService,
      useClass: PaymentService,
    },
  ],
  exports: [IPaymentService],
})
export class PaymentModule {}
