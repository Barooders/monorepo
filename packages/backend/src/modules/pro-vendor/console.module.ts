import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { getRedisConfig } from '@libs/infrastructure/redis/redis.config';
import { ProVendorCLIConsole } from '@modules/pro-vendor/application/pro-vendor.cli';
import { ProductModule } from '@modules/product/product.module';
import { BullModule } from '@nestjs/bull';
import { proVendorSharedServices } from './config';
import { OrderSyncService } from './domain/order-sync.service';
import { IOrderSyncService } from './domain/ports/order-sync.service';
import { QueueNames } from './domain/ports/types';

@Module({
  imports: [
    SharedLoggerModule,
    PrismaModule,
    ProductModule,
    BullModule.registerQueueAsync({
      name: QueueNames.UPDATE_STOCK,
      useFactory: getRedisConfig,
    }),
  ],
  providers: [
    ...proVendorSharedServices,
    ProVendorCLIConsole,
    {
      provide: IOrderSyncService,
      useClass: OrderSyncService,
    },
  ],
  exports: [IOrderSyncService],
})
export class ProVendorConsoleModule {}
