import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';

export class ProductRefusedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'product.refused';
  readonly productInternalId: string;
  readonly metadata: {
    author: Author;
  };

  constructor(props: DomainEventProps<ProductRefusedDomainEvent>) {
    super(props);
    this.productInternalId = props.productInternalId;
    this.metadata = props.metadata;
  }
}
