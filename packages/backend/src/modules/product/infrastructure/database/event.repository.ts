import { EventName, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { ProductCreatedDomainEvent } from '@modules/product/domain/events/product.created.domain-event';
import { ProductUpdatedDomainEvent } from '@modules/product/domain/events/product.updated.domain-event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventRepository {
  constructor(private mainPrisma: PrismaMainClient) {}

  @OnEvent('product.updated', { async: true })
  async handleProductUpdated({
    aggregateId,
    aggregateName,
    productInternalId: productId, // Renamed to productId to keep consistency in Event table
    payload,
    metadata,
  }: ProductUpdatedDomainEvent) {
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
