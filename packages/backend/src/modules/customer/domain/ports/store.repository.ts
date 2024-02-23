import { User } from './user';

export abstract class IStoreRepository {
  abstract createCustomer: (user: User) => Promise<{ id: string }>;
}
