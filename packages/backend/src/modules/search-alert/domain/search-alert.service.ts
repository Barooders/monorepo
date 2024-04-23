import {
  AggregateName,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { capitalize } from 'lodash';
import { QueueNames } from '../config';
import { SavedSearchDeletedDomainEvent } from './events/saved-search.deleted.domain-event';
import { SavedSearchUpdatedDomainEvent } from './events/saved-search.updated.domain-event';
import { SearchAlertSentDomainEvent } from './events/search-alert.sent.domain-event';
import { EmailRepository } from './ports/email-repository';
import { SearchRepository } from './ports/search-repository';
import { SavedSearchEntity } from './ports/saved-search.entity';

@Injectable()
export class SearchAlertService {
  private readonly logger = new Logger(SearchAlertService.name);

  constructor(
    @InjectQueue(QueueNames.SEARCH_ALERT_QUEUE_NAME)
    private searchAlertQueue: Queue,
    private prisma: PrismaMainClient,
    private emailRepository: EmailRepository,
    private searchRepository: SearchRepository,
    private eventEmitter: EventEmitter2,
  ) {}

  async createSavedSearch(
    _userId: UUID,
    _savedSearchDTO: SavedSearchEntity,
  ): Promise<string> {
    throw new Error('Method not implemented.');
  }

  async updateSavedSearch(
    userId: UUID,
    savedSearchUUID: UUID,
    shouldTriggerAlerts: boolean,
  ): Promise<void> {
    const savedSearchId = savedSearchUUID.uuid;
    const customerId = await this.throwIfUpdateNotAuthorizedAndGetCustomerId(
      userId.uuid,
      savedSearchId,
    );

    await this.prisma.searchAlert.upsert({
      where: { searchId: savedSearchId },
      create: {
        searchId: savedSearchId,
        isActive: shouldTriggerAlerts,
      },
      update: {
        isActive: shouldTriggerAlerts,
      },
    });

    this.eventEmitter.emit(
      'saved-search.updated',
      new SavedSearchUpdatedDomainEvent({
        aggregateId: customerId,
        aggregateName: AggregateName.CUSTOMER,
        savedSearchId: savedSearchId,
        payload: { shouldTriggerAlerts: String(shouldTriggerAlerts) },
      }),
    );
  }

  async deleteSavedSearch(userId: UUID, savedSearchUUID: UUID): Promise<void> {
    const savedSearchId = savedSearchUUID.uuid;
    const customerId = await this.throwIfUpdateNotAuthorizedAndGetCustomerId(
      userId.uuid,
      savedSearchId,
    );

    await this.prisma.savedSearch.delete({
      where: { id: savedSearchId },
    });

    this.eventEmitter.emit(
      'saved-search.deleted',
      new SavedSearchDeletedDomainEvent({
        aggregateId: customerId,
        aggregateName: AggregateName.CUSTOMER,
        savedSearchId: savedSearchId,
      }),
    );
  }

  async triggerAllSearchAlerts(): Promise<{
    payload: { triggeredAlerts: string[] };
    metadata: { triggeredAlertCount: number };
  }> {
    const activeSearchAlerts = await this.prisma.searchAlert.findMany({
      where: { isActive: true },
    });

    for (const { id } of activeSearchAlerts) {
      void this.searchAlertQueue.add(
        {
          alertId: id,
        },
        {
          attempts: 2,
          removeOnComplete: true,
          removeOnFail: true,
        },
      );
    }

    return {
      payload: {
        triggeredAlerts: activeSearchAlerts.map(({ id }) => id),
      },
      metadata: { triggeredAlertCount: activeSearchAlerts.length },
    };
  }

  async triggerAlert(alertId: string): Promise<void> {
    const searchAlert = await this.prisma.searchAlert.findUniqueOrThrow({
      where: { id: alertId },
      include: {
        savedSearch: {
          include: {
            customer: { include: { user: true } },
            facetFilters: true,
            numericFilters: true,
          },
        },
      },
    });

    const savedSearch = searchAlert.savedSearch;

    this.logger.debug(`Starting to sync alert ${savedSearch.name}`);

    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const { hits, nbHits } = await this.searchRepository.getSavedSearchResults(
      savedSearch.query ?? '',
      savedSearch.facetFilters,
      savedSearch.numericFilters,
      searchAlert.latestRunAt ?? yesterday,
    );

    this.logger.debug(`Found ${nbHits} results for alert ${savedSearch.id}`);

    await this.prisma.searchAlert.update({
      where: { id: alertId },
      data: {
        latestResultsCount: nbHits,
        latestRunAt: new Date(),
      },
    });

    if (nbHits === 0) return;

    if (!savedSearch.customer.user.email) {
      throw new Error(
        `No email found for customer ${savedSearch.customer.user.id}`,
      );
    }

    const emailPayload = {
      alertName: savedSearch.name,
      countResults: nbHits,
      resultsUrl: savedSearch.resultsUrl ?? '',
      searchFilters: [
        ...savedSearch.facetFilters.map((facetFilter) =>
          capitalize(facetFilter.label),
        ),
        ...savedSearch.numericFilters.map(
          (numericFilter) =>
            `${numericFilter.operator} ${capitalize(numericFilter.value)}`,
        ),
      ].join('・'),
      results: hits.slice(0, 3).map((hit) => ({
        ...hit,
        discount: String(Math.round(Number(hit.discount))),
      })),
    };

    this.logger.debug(
      `Sending email with payload: ${jsonStringify(emailPayload, 2)}`,
    );

    await this.emailRepository.sendSearchAlertResults(
      savedSearch.customer.user.email,
      emailPayload,
    );

    this.eventEmitter.emit(
      'search-alert.sent',
      new SearchAlertSentDomainEvent({
        aggregateId: savedSearch.customer.authUserId,
        aggregateName: AggregateName.CUSTOMER,
        searchAlertId: alertId,
      }),
    );
  }

  private async throwIfUpdateNotAuthorizedAndGetCustomerId(
    userId: string,
    savedSearchId: string,
  ) {
    const { customerId } = await this.prisma.savedSearch.findUniqueOrThrow({
      where: { id: savedSearchId },
      select: { customerId: true },
    });

    if (customerId !== userId) {
      throw new UnauthorizedException(
        `User ${userId} is not authorized to update saved search ${savedSearchId}`,
      );
    }

    return customerId;
  }
}
