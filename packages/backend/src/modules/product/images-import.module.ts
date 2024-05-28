import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { PrismaModule } from '@libs/domain/prisma.module';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { getRedisConfig } from '@libs/infrastructure/redis/redis.config';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ImportImagesConsumer } from './application/import-images.consumer.redis';
import { QueueNames } from './config';
import { IImageUploadsClient } from './domain/ports/image-uploads.client';
import { ImageUploadsClient } from './infrastructure/images/image-uploads-client';

const commonImports = [
  SharedLoggerModule,
  PrismaModule,
  BullModule.registerQueueAsync({
    name: QueueNames.IMPORT_IMAGES,
    useFactory: getRedisConfig,
  }),
];

const commonProviders = [
  {
    provide: IImageUploadsClient,
    useClass: ImageUploadsClient,
  },
];

@Module({
  imports: [
    ...commonImports,
    BullBoardModule.forFeature({
      name: QueueNames.IMPORT_IMAGES,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [],
  providers: [...commonProviders, ImportImagesConsumer],
})
export class ImagesImportConsumerModule {}
