import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { CustomerController } from './application/customer.web';
import { CustomerWebhooksHasuraController } from './application/customer.webhook.hasura';
import { commonProviders } from './customer.base.module';
import { PaymentAccountProviderService } from './domain/payment-account-provider.service';

@Module({
  imports: [PrismaModule],
  controllers: [CustomerController, CustomerWebhooksHasuraController],
  providers: commonProviders,
  exports: [PaymentAccountProviderService],
})
export class CustomerModule {}
