import { PrismaModule } from '@libs/domain/prisma.module';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { getRedisConfig } from '@libs/infrastructure/redis/redis.config';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { SearchAlertCLIConsole } from './application/search-alert.cli';
import { SearchAlertConsumer } from './application/search-alert.consumer.redis';
import { QueueNames } from './config';
import { EmailRepository } from './domain/ports/email-repository';
import { SearchRepository } from './domain/ports/search-repository';
import { SearchAlertService } from './domain/search-alert.service';
import { SendgridRepository } from './infrastructure/email/sendgrid.repository';
import { TypesenseRepository } from './infrastructure/search/typesense.repository';

const commonImports = [
  SharedLoggerModule,
  PrismaModule,
  BullModule.registerQueueAsync({
    name: QueueNames.SEARCH_ALERT_QUEUE_NAME,
    useFactory: getRedisConfig,
  }),
];

const commonProviders = [
  SearchAlertService,
  {
    provide: SearchRepository,
    useClass: TypesenseRepository,
  },
  {
    provide: EmailRepository,
    useClass: SendgridRepository,
  },
];

@Module({
  imports: commonImports,
  controllers: [],
  providers: [...commonProviders, SearchAlertCLIConsole],
})
export class SearchAlertConsoleModule {}

@Module({
  imports: commonImports,
  controllers: [],
  providers: [...commonProviders, SearchAlertConsumer],
})
export class SearchAlertConsumerModule {}
