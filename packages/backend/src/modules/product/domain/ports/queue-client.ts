import { UUID } from '@libs/domain/value-objects';

export interface QueueOptions {
  withoutDelay?: boolean;
}
export abstract class IQueueClient {
  abstract planProductIndexation(
    productId: UUID,
    options?: QueueOptions,
  ): Promise<void>;
}
