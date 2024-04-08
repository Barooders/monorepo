import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BasicAuthMiddleware } from '@libs/application/middleware/basic-auth.middleware';
import { ProVendorConsumerModule } from '@modules/pro-vendor/consumer.module';
import { IndexationConsumerModule } from '@modules/product/indexation.module';
import { SearchAlertConsumerModule } from '@modules/search-alert/module';
import { Module } from '@nestjs/common';
import { BaseModule } from './base.module';

@Module({
  imports: [
    ProVendorConsumerModule,
    BaseModule,
    SearchAlertConsumerModule,
    IndexationConsumerModule,
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
      middleware: BasicAuthMiddleware,
    }),
  ],
})
export class ConsumerModule {}
