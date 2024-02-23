import { PrismaModule } from '@libs/domain/prisma.module';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { getRedisConfig } from '@libs/infrastructure/redis/redis.config';
import { ProductModule } from '@modules/product/product.module';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { StockUpdateConsumer } from './application/stock-update.consumer.redis';
import { proVendorSharedServices } from './config';
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
  controllers: [],
  providers: [...proVendorSharedServices, StockUpdateConsumer],
})
export class ProVendorConsumerModule {}
