import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class SavedSearchDeletedDomainEvent extends DomainEvent {
  static readonly EVENT_NAME = 'saved-search.deleted';
  readonly savedSearchId: string;

  constructor(props: DomainEventProps<SavedSearchDeletedDomainEvent>) {
    super(props);
    this.savedSearchId = props.savedSearchId;
  }
}
