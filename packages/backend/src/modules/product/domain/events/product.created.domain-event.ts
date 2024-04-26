import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';
import { Author } from '@libs/domain/types';

export class ProductCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'product.created';
  readonly productInternalId: string;
  readonly productShopifyId: bigint;
  readonly metadata: { author: Author };

  constructor(props: DomainEventProps<ProductCreatedDomainEvent>) {
    super(props);
    this.productInternalId = props.productInternalId;
    this.productShopifyId = props.productShopifyId;
    this.metadata = props.metadata;
  }
}
