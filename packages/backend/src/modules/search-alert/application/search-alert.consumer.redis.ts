import { envName } from '@config/env/env.config';
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
import { SearchAlertService } from '../domain/search-alert.service';

const MAX_CONCURRENCY = envName === Environments.PRODUCTION ? 3 : 1;

@Processor(QueueNames.SEARCH_ALERT_QUEUE_NAME)
export class SearchAlertConsumer {
  private readonly logger = new Logger(SearchAlertConsumer.name);

  constructor(
    private searchAlertService: SearchAlertService,
    private readonly loggerService: LoggerService,
  ) {}

  @Process({ concurrency: MAX_CONCURRENCY })
  @CaptureBackgroundTransaction({
    name: QueueNames.SEARCH_ALERT_QUEUE_NAME,
    type: BackgroundTask.CONSUMER,
  })
  async transcode(job: Job<QueuePayload[QueueNames.SEARCH_ALERT_QUEUE_NAME]>) {
    const { alertId } = job.data;
    this.loggerService.setSharedContext({});

    this.logger.debug(`Triggering alert for ${alertId}`);
    await this.searchAlertService.triggerAlert(alertId);
  }
}
