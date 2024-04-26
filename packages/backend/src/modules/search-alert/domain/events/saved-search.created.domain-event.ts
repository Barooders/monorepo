import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class SavedSearchCreatedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'saved-search.created';
  readonly savedSearchId: string;

  constructor(props: DomainEventProps<SavedSearchCreatedDomainEvent>) {
    super(props);
    this.savedSearchId = props.savedSearchId;
  }
}
