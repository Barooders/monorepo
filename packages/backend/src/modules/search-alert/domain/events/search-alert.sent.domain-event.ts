import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class SearchAlertSentDomainEvent extends DomainEvent {
  readonly searchAlertId: string;

  constructor(props: DomainEventProps<SearchAlertSentDomainEvent>) {
    super(props);
    this.searchAlertId = props.searchAlertId;
  }
}
