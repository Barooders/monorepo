import { PriceOffer } from '@libs/domain/prisma.main.client';

export abstract class IPriceOfferService {
  abstract updatePriceOfferStatusFromOrder(
    usedDiscountCodes: string[],
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
