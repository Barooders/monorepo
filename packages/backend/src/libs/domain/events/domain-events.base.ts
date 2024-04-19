import { ArgumentNotProvidedException } from '@libs/domain/exceptions';
import { randomUUID } from 'crypto';
import { Guard } from '../guard';

export type DomainEventProps<T> = Omit<T, 'id'> & {
  aggregateId: string;
};

export abstract class DomainEvent {
  public readonly id: string;
  public readonly aggregateId: string;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'DomainEvent props should not be empty',
      );
    }
    this.id = randomUUID();
    this.aggregateId = props.aggregateId;
  }
}
