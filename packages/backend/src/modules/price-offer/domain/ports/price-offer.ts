import { PriceOffer } from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';

export abstract class IPriceOfferService {
  abstract updatePriceOfferStatusFromOrder(
    priceOffers: Pick<PriceOffer, 'id'>[],
    orderId: string,
    author: Author,
  ): Promise<void>;
}

export type PriceOfferUpdates = Partial<
  Pick<
    PriceOffer,
    | 'status'
    | 'publicNote'
    | 'internalNote'
    | 'newPriceInCents'
    | 'discountCode'
  >
>;
