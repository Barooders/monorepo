import { Percentage } from '@libs/domain/value-objects';

export abstract class ICommissionRepository {
  abstract getGlobalB2BBuyerCommission(): Promise<Percentage>;
}
