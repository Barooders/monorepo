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
  ],
})
export class ConsumerModule {}
