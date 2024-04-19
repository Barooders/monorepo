import { EventName, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { PriceOfferUpdatedDomainEvent } from '@modules/price-offer/domain/events/price-offer.updated.domain-event';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class EventRepository {
  constructor(private mainPrisma: PrismaMainClient) {}

  @OnEvent('price-offer.updated', { async: true })
  async handlePriceOfferUpdated({
    aggregateId,
    aggregateName,
    priceOfferId,
    newStatus,
  }: PriceOfferUpdatedDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.PRICE_OFFER_UPDATED,
        payload: {
          priceOfferId,
          newStatus,
        },
      },
    });
  }

  @OnEvent('price-offer.created', { async: true })
  async handlePriceOfferCreated({
    aggregateId,
    aggregateName,
    priceOfferId,
  }: PriceOfferUpdatedDomainEvent) {
    await this.mainPrisma.event.create({
      data: {
        aggregateName,
        aggregateId,
        name: EventName.PRICE_OFFER_CREATED,
        payload: {
          priceOfferId,
        },
      },
    });
  }
}
