import { Amount } from '@libs/domain/value-objects';

export abstract class ICommissionRepository {
  abstract getPriceWithoutB2BGlobalBuyerCommission(
    price: Amount,
  ): Promise<Amount>;
}
