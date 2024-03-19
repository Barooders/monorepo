import { envName } from '@config/env/env.config';
import { Environments } from '@config/env/types';
import { UUID } from '@libs/domain/value-objects';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueNames, QueuePayload } from '../config';
import { PublicIndexationService } from '../domain/public-indexation.service';
import { StoreMapper } from '../infrastructure/store/store.mapper';

const MAX_CONCURRENCY = envName === Environments.PRODUCTION ? 6 : 1;

@Processor(QueueNames.PRODUCTS_TO_INDEX)
export class ProductIndexationConsumer {
  private readonly logger = new Logger(ProductIndexationConsumer.name);

  constructor(
    private publicIndexationService: PublicIndexationService,
    private storeMapper: StoreMapper,
    private readonly loggerService: LoggerService,
  ) {}

  @Process({ concurrency: MAX_CONCURRENCY })
  async transcode(job: Job<QueuePayload[QueueNames.PRODUCTS_TO_INDEX]>) {
    const { productId } = job.data;
    this.loggerService.setSharedContext({});

    this.logger.warn(`Indexing product ${productId}`);

    const productUuid = new UUID({ uuid: productId });
    const variantsToIndex =
      await this.storeMapper.mapVariantsToIndexFromProductId(productUuid);

    await this.publicIndexationService.indexVariants(variantsToIndex);
  }
}
