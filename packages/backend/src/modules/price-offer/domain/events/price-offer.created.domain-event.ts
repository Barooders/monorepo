import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';

export class PriceOfferCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'price-offer.created';
  readonly payload: Record<string, string>;
  readonly metadata: {
    author: Author;
    newPriceInCents: number;
    quantity: number;
    includedBuyerCommissionPercentage: number;
    status: string;
  };
  constructor(props: DomainEventProps<PriceOfferCreatedDomainEvent>) {
    super(props);
    this.metadata = props.metadata;
    this.payload = props.payload;
  }
}
