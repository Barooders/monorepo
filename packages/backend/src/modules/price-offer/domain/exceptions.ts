import { NotFoundException } from '@libs/domain/exceptions';
import { PriceOfferStatus } from '@libs/domain/prisma.main.client';
import { Amount, UUID } from '@libs/domain/value-objects';
import { BadRequestException, ForbiddenException } from '@nestjs/common';

export class OngoingPriceOfferExisting extends BadRequestException {
  constructor(buyerId: UUID, productId: UUID) {
    super(
      `A Price Offer is still ongoing for buyer (${buyerId.uuid}) and product (${productId.uuid})`,
    );
  }
}

export class PriceOfferIsNotAcceptable extends BadRequestException {
  constructor(newPrice: Amount, productId: UUID) {
    super(
      `A Price Offer of ${newPrice.formattedAmount} cannot be accepted for the product ${productId.uuid}`,
    );
  }
}

export class PriceOfferNotFound extends NotFoundException {
  constructor(priceOfferId: UUID) {
    super(`Price Offer (${priceOfferId.uuid}) was not found in database`);
  }
}

export class IncoherentPriceOfferStatus extends BadRequestException {
  constructor(priceOfferId: UUID, status: PriceOfferStatus) {
    super(
      `The Price Offer ${priceOfferId.uuid} is is incoherent status (${status})`,
    );
  }
}

export class ForbiddenParticipation extends ForbiddenException {
  constructor(priceOfferId: UUID, userId: UUID) {
    super(
      `User ${userId.uuid} cannot take action on price offer ${priceOfferId.uuid}`,
    );
  }
}
