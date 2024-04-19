import { UUID } from '@libs/domain/value-objects';
import { User } from './user';

export abstract class IStoreRepository {
  abstract createCustomer: (user: User) => Promise<{ id: string }>;
  abstract anonymizeCustomer: (userId: UUID, newEmail: string) => Promise<void>;
}
