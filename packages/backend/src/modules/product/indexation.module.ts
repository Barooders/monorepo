import { PrismaModule } from '@libs/domain/prisma.module';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { getRedisConfig } from '@libs/infrastructure/redis/redis.config';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CollectionIndexationCLIConsole } from './application/collection-indexation.cli';
import { ProductIndexationCLIConsole } from './application/product-indexation.cli';
import { ProductIndexationConsumer } from './application/product-indexation.consumer.redis';
import { QueueNames } from './config';
import { IndexationService } from './domain/indexation.service';
import { IQueueClient } from './domain/ports/queue-client';
import { ISearchClient } from './domain/ports/search-client';
import { PublicIndexationService } from './domain/public-indexation.service';
import { QueueClient } from './infrastructure/queue/queue.client';
import { SearchClient } from './infrastructure/search/search.client';
import { StoreMapper } from './infrastructure/store/store.mapper';

const commonImports = [
  SharedLoggerModule,
  PrismaModule,
  BullModule.registerQueueAsync({
    name: QueueNames.PRODUCTS_TO_INDEX,
    useFactory: getRedisConfig,
  }),
];

const commonProviders = [
  PublicIndexationService,
  IndexationService,
  {
    provide: ISearchClient,
    useClass: SearchClient,
  },
  StoreMapper,
];

@Module({
  imports: commonImports,
  controllers: [],
  providers: [
    ...commonProviders,
    {
      provide: IQueueClient,
      useClass: QueueClient,
    },
    ProductIndexationCLIConsole,
    CollectionIndexationCLIConsole,
  ],
})
export class IndexationConsoleModule {}

@Module({
  imports: commonImports,
  controllers: [],
  providers: [...commonProviders, ProductIndexationConsumer],
})
export class IndexationConsumerModule {}
