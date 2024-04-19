import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { PriceOfferStatus } from '@libs/domain/prisma.main.client';

export class PriceOfferUpdatedDomainEvent extends DomainEvent {
  readonly priceOfferId: string;
  readonly newStatus: PriceOfferStatus;

  constructor(props: DomainEventProps<PriceOfferUpdatedDomainEvent>) {
    super(props);
    this.priceOfferId = props.priceOfferId;
    this.newStatus = props.newStatus;
  }
}
