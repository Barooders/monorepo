import { Amount } from '@libs/domain/value-objects';
import { ICommissionRepository } from '@modules/price-offer/domain/ports/commission.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommissionRepository implements ICommissionRepository {
  async getPriceWithoutB2BGlobalBuyerCommission(
    _price: Amount,
  ): Promise<Amount> {
    throw new Error('Method not implemented.');
  }
}
