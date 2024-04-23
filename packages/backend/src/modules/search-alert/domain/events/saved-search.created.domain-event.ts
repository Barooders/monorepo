import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class SavedSearchCreatedDomainEvent extends DomainEvent {
  readonly savedSearchId: string;

  constructor(props: DomainEventProps<SavedSearchCreatedDomainEvent>) {
    super(props);
    this.savedSearchId = props.savedSearchId;
  }
}
