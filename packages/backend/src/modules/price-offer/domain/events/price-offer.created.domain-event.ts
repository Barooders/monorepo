import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class PriceOfferCreatedDomainEvent extends DomainEvent {
  constructor(props: DomainEventProps<PriceOfferCreatedDomainEvent>) {
    super(props);
  }
}
