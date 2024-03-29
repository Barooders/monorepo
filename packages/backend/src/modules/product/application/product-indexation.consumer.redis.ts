import { envName } from '@config/env/env.config';
import { Environments } from '@config/env/types';
import { UUID } from '@libs/domain/value-objects';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { QueueNames, QueuePayload } from '../config';
import { VariantIndexationService } from '../domain/variant-indexation.service';
import { StoreMapper } from '../infrastructure/store/store.mapper';

const MAX_CONCURRENCY = envName === Environments.LOCAL ? 1 : 6;
const ONE_HOUR = 1000 * 60 * 60;

@Processor(QueueNames.PRODUCTS_TO_INDEX)
export class ProductIndexationConsumer {
  private readonly logger = new Logger(ProductIndexationConsumer.name);

  constructor(
    private variantIndexationService: VariantIndexationService,
    private storeMapper: StoreMapper,
    private readonly loggerService: LoggerService,
  ) {}

  @Process({ concurrency: MAX_CONCURRENCY })
  async transcode(job: Job<QueuePayload[QueueNames.PRODUCTS_TO_INDEX]>) {
    const { productId } = job.data;
    this.loggerService.setSharedContext({});

    this.logger.log(`Indexing product ${productId}`);

    const startExecutionTime = Date.now();
    const waitingTime = startExecutionTime - job.timestamp;
    if (waitingTime > ONE_HOUR) {
      this.logger.warn(
        `Job ${job.id} for indexing product ${productId} was waiting for ${waitingTime}ms`,
      );
    }

    const productUuid = new UUID({ uuid: productId });
    const variantsToIndex =
      await this.storeMapper.mapVariantsToIndexFromProductId(productUuid);

    await this.variantIndexationService.indexVariants(variantsToIndex);
  }
}
