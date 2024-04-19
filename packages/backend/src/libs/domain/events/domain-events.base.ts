import { ArgumentNotProvidedException } from '@libs/domain/exceptions';
import { randomUUID } from 'crypto';
import { Guard } from '../guard';
import { AggregateName } from '../prisma.main.client';

export type DomainEventProps<T> = Omit<T, 'id'> & {
  aggregateId: string;
  aggregateName: AggregateName;
};

export abstract class DomainEvent {
  public readonly id: string;
  public readonly aggregateId: string;
  public readonly aggregateName: AggregateName;

  constructor(props: DomainEventProps<unknown>) {
    if (Guard.isEmpty(props)) {
      throw new ArgumentNotProvidedException(
        'DomainEvent props should not be empty',
      );
    }
    this.id = randomUUID();
    this.aggregateId = props.aggregateId;
    this.aggregateName = props.aggregateName;
  }
}
