import { CommissionRule, Prisma } from '@libs/domain/prisma.main.client';
import { Percentage } from '@libs/domain/value-objects';

export interface ParsedCommissionRule extends CommissionRule {
  criteria: { type: Prisma.JsonValue; value: Prisma.JsonValue }[];
  rules: { type: Prisma.JsonValue; value: Prisma.JsonValue }[];
}

export interface VendorForCommission {
  buyerCommissionRate: number;
  hasOwnShipping: boolean;
  sellerName: string;
}

export abstract class ICommissionRepository {
  abstract getGlobalB2BBuyerCommission(): Promise<Percentage>;
  abstract findRulesByVendorId(
    vendorId: string,
  ): Promise<ParsedCommissionRule[]>;
  abstract getVendorCommissionConfigFromId(
    vendorId: string,
  ): Promise<VendorForCommission>;
}
