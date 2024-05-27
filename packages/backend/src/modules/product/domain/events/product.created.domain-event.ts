import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';

export class ProductCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'product.created';
  readonly productInternalId: string;
  readonly metadata: { author: Author };

  constructor(props: DomainEventProps<ProductCreatedDomainEvent>) {
    super(props);
    this.productInternalId = props.productInternalId;
    this.metadata = props.metadata;
  }
}
