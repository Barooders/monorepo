import { Module } from '@nestjs/common';

import { CustomerRepository as SharedCustomerRepository } from '@libs/domain/customer.repository';
import { PrismaModule } from '@libs/domain/prisma.module';
import { CustomerController } from './application/customer.web';
import { CustomerWebhooksHasuraController } from './application/customer.webhook.hasura';
import { CustomerService } from './domain/customer.service';
import { PaymentAccountProviderService } from './domain/payment-account-provider.service';
import { IInternalNotificationClient } from './domain/ports/internal-notification.client';
import { IPaymentProvider } from './domain/ports/payment-provider';
import { IStoreRepository } from './domain/ports/store.repository';
import { SlackClient } from './infrastructure/internal-notification/slack.client';
import { StripeClient } from './infrastructure/payment-provider/stripe.client';
import { ShopifyRepository } from './infrastructure/store/shopify.repository';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController, CustomerWebhooksHasuraController],
  providers: [
    CustomerService,
    PaymentAccountProviderService,
    SharedCustomerRepository,
    {
      provide: IPaymentProvider,
      useClass: StripeClient,
    },
    {
      provide: IInternalNotificationClient,
      useClass: SlackClient,
    },
    { provide: IStoreRepository, useClass: ShopifyRepository },
  ],
  exports: [PaymentAccountProviderService],
})
export class CustomerModule {}
