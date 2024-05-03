import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';

export class CustomerRequestCreatedEvent extends DomainEvent {
  static readonly EVENT_NAME = 'customer-request.created';
  readonly payload: Record<string, string | number>;
  readonly metadata: {
    author: Author;
  };

  constructor(props: DomainEventProps<CustomerRequestCreatedEvent>) {
    super(props);
    this.metadata = props.metadata;
    this.payload = props.payload;
  }
}
