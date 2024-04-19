import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { CustomerCLIConsole } from './application/customer.cli';
import { commonProviders } from './customer.base.module';
import { PaymentAccountProviderService } from './domain/payment-account-provider.service';

@Module({
  imports: [PrismaModule],
  providers: [...commonProviders, CustomerCLIConsole],
  exports: [PaymentAccountProviderService],
})
export class CustomerConsoleModule {}
