import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';
import { PriceOfferUpdates } from '../ports/price-offer';

export class PriceOfferUpdatedDomainEvent extends DomainEvent {
  readonly priceOfferId: string;
  readonly updates: PriceOfferUpdates;
  readonly metadata?: {
    author: Author;
  };

  constructor(props: DomainEventProps<PriceOfferUpdatedDomainEvent>) {
    super(props);
    this.priceOfferId = props.priceOfferId;
    this.updates = props.updates;
    this.metadata = props.metadata;
  }
}
