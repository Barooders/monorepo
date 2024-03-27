export abstract class IPriceOfferService {
  abstract updatePriceOfferStatusFromOrder(
    usedDiscountCodes: string[],
  ): Promise<void>;
}
