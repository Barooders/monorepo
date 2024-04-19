import { EventName, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import { ProductCreatedDomainEvent } from '@modules/product/domain/events/product.created.domain-event';
import { ProductUpdatedDomainEvent } from '@modules/product/domain/events/product.updated.domain-event';
import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventRepository {
  private readonly logger = new Logger(EventRepository.name);

  constructor(private mainPrisma: PrismaMainClient) {}

  @OnEvent('product.updated', { async: true })
  async handleProductUpdated({
    aggregateId,
    aggregateName,
    productInternalId: productId, // Renamed to productId to keep consistency in Event table
    payload,
    metadata,
  }: ProductUpdatedDomainEvent) {
    this.logger.log(
      `Updated product ${productId} with ${jsonStringify(payload)}`,
    );

    if (metadata.author.type === 'backend') return;

    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.PRODUCT_UPDATED,
        payload: {
          ...payload,
          productId,
        },
        metadata,
      },
    });
  }

  @OnEvent('product.refused', { async: true })
  async handleProductRefused({
    aggregateId,
    aggregateName,
    productInternalId: productId, // Renamed to productId to keep consistency in Event table
    metadata,
  }: ProductUpdatedDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.PRODUCT_REFUSED,
        payload: {
          productId,
        },
        metadata,
      },
    });
  }

  @OnEvent('product.created', { async: true })
  async handleProductCreated({
    aggregateId,
    aggregateName,
    productInternalId: productId, // Renamed to productId to keep consistency in Event table
    productShopifyId,
    metadata,
  }: ProductCreatedDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.PRODUCT_CREATED,
        payload: {
          productId,
          productShopifyId: productShopifyId.toString(),
        },
        metadata,
      },
    });
  }
}
