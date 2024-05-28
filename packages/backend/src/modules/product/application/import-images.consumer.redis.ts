import { envName } from '@config/env/env-name.config';
import { Environments } from '@config/env/types';
import {
  BackgroundTask,
  CaptureBackgroundTransaction,
} from '@libs/application/decorators/capture-background-transaction';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueNames, QueuePayload } from '../config';

const MAX_CONCURRENCY = envName === Environments.LOCAL ? 1 : 6;

@Processor(QueueNames.IMPORT_IMAGES)
export class ImportImagesConsumer {
  private readonly logger = new Logger(ImportImagesConsumer.name);

  constructor(private readonly loggerService: LoggerService) {}

  @Process({ concurrency: MAX_CONCURRENCY })
  @CaptureBackgroundTransaction({
    name: QueueNames.IMPORT_IMAGES,
    type: BackgroundTask.CONSUMER,
  })
  async transcode(job: Job<QueuePayload[QueueNames.IMPORT_IMAGES]>) {
    const { storeProductId, imageUrls } = job.data;
    this.loggerService.setSharedContext({});

    this.logger.log(`Import images for product ${storeProductId}`, {
      imageUrls,
    });
  }
}
