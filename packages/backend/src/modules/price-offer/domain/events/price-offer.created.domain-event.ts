import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';

export class PriceOfferCreatedDomainEvent extends DomainEvent {
  readonly payload: Record<string, string>;
  readonly metadata: {
    author: Author;
  };
  constructor(props: DomainEventProps<PriceOfferCreatedDomainEvent>) {
    super(props);
    this.metadata = props.metadata;
    this.payload = props.payload;
  }
}
