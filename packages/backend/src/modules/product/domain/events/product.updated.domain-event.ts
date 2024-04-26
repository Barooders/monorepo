import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';

export class ProductUpdatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'product.updated';
  readonly productInternalId: string;
  readonly payload: Record<string, any>;
  readonly metadata: {
    author: Author;
    comment?: string;
  };

  constructor(props: DomainEventProps<ProductUpdatedDomainEvent>) {
    super(props);
    this.payload = props.payload;
    this.productInternalId = props.productInternalId;
    this.metadata = props.metadata;
  }
}
