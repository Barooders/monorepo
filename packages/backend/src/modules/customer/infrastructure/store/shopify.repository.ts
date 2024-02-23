import { shopifyApiByToken } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { IStoreRepository } from '@modules/customer/domain/ports/store.repository';
import { User } from '@modules/customer/domain/ports/user';
import { ICustomer } from 'shopify-api-node';

export class ShopifyRepository implements IStoreRepository {
  createCustomer = async (user: User) => {
    const mappedUser = this.mapUser(user);

    const existingCustomer = await shopifyApiByToken.customer.search({
      email: mappedUser.email,
    });

    if (existingCustomer && existingCustomer.length > 0)
      return { id: String(existingCustomer[0].id) };

    const newCustomer = await shopifyApiByToken.customer.create(mappedUser);

    return { id: String(newCustomer.id) };
  };

  mapUser = (user: User): Partial<ICustomer> => ({
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    verified_email: true,
    accepts_marketing: true,
  });
}
