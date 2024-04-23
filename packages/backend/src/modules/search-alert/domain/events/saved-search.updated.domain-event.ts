import {
  DomainEvent,
  DomainEventProps,
} from '@libs/domain/events/domain-events.base';

export class SavedSearchUpdatedDomainEvent extends DomainEvent {
  readonly savedSearchId: string;
  readonly payload: Record<string, string>;

  constructor(props: DomainEventProps<SavedSearchUpdatedDomainEvent>) {
    super(props);
    this.payload = props.payload;
    this.savedSearchId = props.savedSearchId;
  }
}
