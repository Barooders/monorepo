import { UUID } from '@libs/domain/value-objects';

export abstract class IStoreRepository {
  abstract anonymizeCustomer: (userId: UUID, newEmail: string) => Promise<void>;
}
