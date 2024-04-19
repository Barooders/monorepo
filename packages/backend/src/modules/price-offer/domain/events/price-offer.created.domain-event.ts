import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class PriceOfferCreatedDomainEvent extends DomainEvent {
  readonly priceOfferId: string;

  constructor(props: DomainEventProps<PriceOfferCreatedDomainEvent>) {
    super(props);
    this.priceOfferId = props.priceOfferId;
  }
}
