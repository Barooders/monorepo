import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { shopifyApiByToken } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-token.lib';
import { IStoreRepository } from '@modules/customer/domain/ports/store.repository';
import { User } from '@modules/customer/domain/ports/user';
import { Injectable } from '@nestjs/common';
import { ICustomer } from 'shopify-api-node';

@Injectable()
export class ShopifyRepository implements IStoreRepository {
  constructor(protected readonly prisma: PrismaMainClient) {}
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

  anonymizeCustomer = async (userId: UUID, newEmail: string) => {
    const { shopifyId } = await this.prisma.customer.findUniqueOrThrow({
      where: { authUserId: userId.uuid },
      select: { shopifyId: true },
    });

    await shopifyApiByToken.customer.update(Number(shopifyId), {
      email: newEmail,
      first_name: '',
      last_name: '',
    });
  };

  mapUser = (user: Partial<User>): Partial<ICustomer> => ({
    email: user.email,
    first_name: user.firstName,
    last_name: user.lastName,
    verified_email: true,
    accepts_marketing: true,
  });
}
