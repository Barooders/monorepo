import { EventName, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { SavedSearchCreatedDomainEvent } from '@modules/search-alert/domain/events/saved-search.created.domain-event';
import { SavedSearchDeletedDomainEvent } from '@modules/search-alert/domain/events/saved-search.deleted.domain-event';
import { SavedSearchUpdatedDomainEvent } from '@modules/search-alert/domain/events/saved-search.updated.domain-event';
import { SearchAlertSentDomainEvent } from '@modules/search-alert/domain/events/search-alert.sent.domain-event';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventRepository {
  private readonly logger = new Logger(EventRepository.name);

  constructor(private mainPrisma: PrismaMainClient) {}

  @OnEvent('search-alert.sent', { async: true })
  async handleSentSearchAlert({
    aggregateId,
    aggregateName,
    searchAlertId,
  }: SearchAlertSentDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.SEARCH_ALERT_SENT,
        metadata: {
          searchAlertId,
        },
      },
    });
  }

  @OnEvent('saved-search.updated', { async: true })
  async handleSavedSearchUpdated({
    aggregateId,
    aggregateName,
    savedSearchId,
    payload,
  }: SavedSearchUpdatedDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.SAVED_SEARCH_UPDATED,
        payload,
        metadata: {
          savedSearchId,
        },
      },
    });
  }

  @OnEvent('saved-search.created', { async: true })
  async handleSavedSearchCreated({
    aggregateId,
    aggregateName,
    savedSearchId,
  }: SavedSearchCreatedDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.SAVED_SEARCH_CREATED,
        metadata: {
          savedSearchId,
        },
      },
    });
  }

  @OnEvent('saved-search.deleted', { async: true })
  async handleSavedSearchDeleted({
    aggregateId,
    aggregateName,
    savedSearchId,
  }: SavedSearchDeletedDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.SAVED_SEARCH_DELETED,
        metadata: {
          savedSearchId,
        },
      },
    });
  }
}
