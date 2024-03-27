import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Amount } from '@libs/domain/value-objects';
import { ICommissionRepository } from '@modules/price-offer/domain/ports/commission.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommissionRepository implements ICommissionRepository {
  constructor(protected readonly prisma: PrismaMainClient) {}

  async getPriceWithoutB2BGlobalBuyerCommission(
    price: Amount,
  ): Promise<Amount> {
    const commission: { get_global_b2b_buyer_commission: number }[] = await this
      .prisma.$queryRaw`SELECT * FROM GET_GLOBAL_B2B_BUYER_COMMISSION()`;

    if (commission.length !== 1) {
      throw new Error('B2B global buyer commission configuration is invalid');
    }

    const commissionValue = commission[0].get_global_b2b_buyer_commission;

    return new Amount({
      amountInCents: Math.floor(
        price.amountInCents / (1 + commissionValue / 100),
      ),
    });
  }
}
