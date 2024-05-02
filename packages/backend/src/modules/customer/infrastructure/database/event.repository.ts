import { EventName, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { CustomerRequestCreatedEvent } from '@modules/customer/domain/events/customer-request.created.domain-events';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventRepository {
  private readonly logger = new Logger(EventRepository.name);

  constructor(private mainPrisma: PrismaMainClient) {}

  @OnEvent(CustomerRequestCreatedEvent.EVENT_NAME, { async: true })
  async handleCustomerRequestCreatedEvent({
    aggregateId,
    aggregateName,
    payload,
    metadata,
  }: CustomerRequestCreatedEvent) {
    this.logger.log(
      `Customer ${metadata.author.id} created request: ${jsonStringify(payload)}`,
    );

    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.CUSTOMER_REQUEST_CREATED,
        payload: {
          ...payload,
        },
        metadata,
      },
    });
  }
}
