import { Customer, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { IStoreRepository } from './ports/store.repository';
import { User } from './ports/user';

@Injectable()
export class CustomerService {
  constructor(
    protected readonly storeRepository: IStoreRepository,
    protected readonly prisma: PrismaMainClient,
  ) {}

  async updateUserInfo(userId: UUID, { phoneNumber }: Partial<Customer>) {
    const concreteUpdates = {
      ...(phoneNumber && { phoneNumber }),
    };

    await this.prisma.customer.update({
      where: { authUserId: userId.uuid },
      data: concreteUpdates,
    });
    return;
  }

  async handleSignup(user: User) {
    user.userName = user.userName.trim();
    const { id: eCommerceId } = await this.storeRepository.createCustomer(user);
    const existingCustomer = await this.prisma.customer.findFirst({
      where: { shopifyId: Number(eCommerceId) },
    });

    if (existingCustomer) return;

    await this.prisma.customer.create({
      data: {
        shopifyId: Number(eCommerceId),
        firstName: user.firstName,
        lastName: user.lastName,
        sellerName: user.userName,
        authUserId: user.id,
        phoneNumber: user.phone,
        profilePictureShopifyCdnUrl: user.profilePictureUrl,
        negociationAgreements: {
          create: {
            maxAmountPercent: 10,
            priority: 1,
          },
        },
      },
    });

    await this.prisma.paymentAccounts.updateMany({
      where: { email: user.email },
      data: { customerId: user.id, email: null },
    });

    await this.prisma.order.updateMany({
      where: { customerEmail: user.email },
      data: { customerId: user.id },
    });
  }

  async upsertNegociationAgreement(
    userId: UUID,
    maxAmountPercent: number,
  ): Promise<{ id: UUID }> {
    const existingAgreement = await this.prisma.negociationAgreement.findFirst({
      where: { vendorId: userId.uuid },
    });

    const data = { maxAmountPercent, priority: 1, vendorId: userId.uuid };

    const { id } = await (existingAgreement
      ? this.prisma.negociationAgreement.update({
          where: { id: existingAgreement.id },
          data,
          select: { id: true },
        })
      : this.prisma.negociationAgreement.create({
          data,
          select: { id: true },
        }));

    return { id: new UUID({ uuid: id }) };
  }

  async deleteNegociationAgreement(userId: UUID) {
    await this.prisma.negociationAgreement.deleteMany({
      where: { vendorId: userId.uuid },
    });
  }
}
