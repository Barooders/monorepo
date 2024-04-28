import { envName } from '@config/env/env-name.config';
import { Environments } from '@config/env/types';
import { UUID } from '@libs/domain/value-objects';
import { QueueNames } from '@modules/product/config';
import { ProductCreatedDomainEvent } from '@modules/product/domain/events/product.created.domain-event';
import { ProductUpdatedDomainEvent } from '@modules/product/domain/events/product.updated.domain-event';
import {
  IQueueClient,
  QueueOptions,
} from '@modules/product/domain/ports/queue-client';
import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Queue } from 'bull';

const FORTY_FIVE_MINUTES = 45 * 60 * 1000;
const QUEUE_DELAY = envName === Environments.LOCAL ? 0 : FORTY_FIVE_MINUTES;

export class QueueClient implements IQueueClient {
  private readonly logger = new Logger(QueueClient.name);

  constructor(
    @InjectQueue(QueueNames.PRODUCTS_TO_INDEX)
    private productIndexationQueue: Queue,
  ) {}

  async planProductIndexation(
    { uuid: productId }: UUID,
    options?: QueueOptions,
  ): Promise<void> {
    this.logger.warn(`Planning indexation for product ${productId}`);

    await this.productIndexationQueue.add(
      {
        productId,
      },
      {
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: true,
        delay: options?.withoutDelay ? 0 : QUEUE_DELAY,
      },
    );
  }

  @OnEvent(ProductCreatedDomainEvent.EVENT_NAME, { async: true })
  @OnEvent(ProductUpdatedDomainEvent.EVENT_NAME, { async: true })
  async triggerProductIndexation({
    productInternalId,
  }: ProductCreatedDomainEvent | ProductUpdatedDomainEvent) {
    await this.planProductIndexation(new UUID({ uuid: productInternalId }));
  }
}
