import {
  AggregateName,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { capitalize } from 'lodash';
import { QueueNames } from '../config';
import { SearchAlertSentDomainEvent } from './events/search-alert.sent.domain-event';
import { EmailRepository } from './ports/email-repository';
import { SearchRepository } from './ports/search-repository';

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
}
