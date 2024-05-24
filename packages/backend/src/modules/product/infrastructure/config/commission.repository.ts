import { Prisma, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Percentage } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import {
  ICommissionRepository,
  ParsedCommissionRule,
  VendorForCommission,
} from '@modules/product/domain/ports/commission.repository';
import { Injectable } from '@nestjs/common';

const mapJsonConditionToTypeAndValue = (
  jsonCondition: Prisma.JsonValue,
  name: string,
): { type: Prisma.JsonValue; value: Prisma.JsonValue } => {
  if (
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    !jsonCondition ||
    typeof jsonCondition !== 'object' ||
    Array.isArray(jsonCondition)
  )
    throw new Error(`${name} is not valid: ${jsonStringify(jsonCondition)}`);

  const { type, value } = jsonCondition;

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!type || !value)
    throw new Error(
      `${name} does not have type and value: ${jsonStringify(jsonCondition)}`,
    );
  return { type, value };
};

const mapCriteriaToTypeAndValue = (criteria: Prisma.JsonValue) => {
  return mapJsonConditionToTypeAndValue(criteria, 'Criteria item');
};
const mapRuleToTypeAndValue = (criteria: Prisma.JsonValue) => {
  return mapJsonConditionToTypeAndValue(criteria, 'Commission rule');
};

@Injectable()
export class CommissionRepository implements ICommissionRepository {
  constructor(protected readonly prisma: PrismaMainClient) {}

  async getGlobalB2BBuyerCommission(): Promise<Percentage> {
    const commission: { get_global_b2b_buyer_commission: number }[] = await this
      .prisma.$queryRaw`SELECT * FROM GET_GLOBAL_B2B_BUYER_COMMISSION()`;

    if (commission.length !== 1) {
      throw new Error('B2B global buyer commission configuration is invalid');
    }

    return new Percentage({
      percentage: commission[0].get_global_b2b_buyer_commission / 100,
    });
  }

  async findRulesByVendorId(vendorId: string): Promise<ParsedCommissionRule[]> {
    const rules = await this.prisma.commissionRule.findMany({
      where: { customerId: vendorId },
    });

    return rules.map((rule) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!rule.rules || !Array.isArray(rule.rules))
        throw new Error('Commission rules are not an array');

      if (!Array.isArray(rule.criteria))
        throw new Error('Commission criteria are not an array');

      return {
        ...rule,
        criteria: rule.criteria.map(mapCriteriaToTypeAndValue),
        rules: rule.rules.map(mapRuleToTypeAndValue),
      };
    });
  }

  async getVendorCommissionConfigFromId(
    vendorId: string,
  ): Promise<VendorForCommission> {
    const { buyerCommissionRate, usedShipping, sellerName } =
      await this.prisma.customer.findUniqueOrThrow({
        where: { authUserId: vendorId },
        select: {
          buyerCommissionRate: true,
          usedShipping: true,
          sellerName: true,
        },
      });

    return {
      buyerCommissionRate,
      hasOwnShipping: usedShipping === 'vendor',
      sellerName: sellerName ?? '',
    };
  }
}
