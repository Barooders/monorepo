import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class SavedSearchDeletedDomainEvent extends DomainEvent {
  readonly savedSearchId: string;

  constructor(props: DomainEventProps<SavedSearchDeletedDomainEvent>) {
    super(props);
    this.savedSearchId = props.savedSearchId;
  }
}
