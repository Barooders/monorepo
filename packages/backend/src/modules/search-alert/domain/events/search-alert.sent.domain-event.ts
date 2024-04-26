import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class SearchAlertSentDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'search-alert.sent';
  readonly searchAlertId: string;

  constructor(props: DomainEventProps<SearchAlertSentDomainEvent>) {
    super(props);
    this.searchAlertId = props.searchAlertId;
  }
}
