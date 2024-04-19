import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Injectable, Logger } from '@nestjs/common';
import { IMarketingClient } from './ports/marketing.client';
import { IStoreRepository } from './ports/store.repository';
import { User } from './ports/user';

@Injectable()
export class CustomerService {
  private readonly logger: Logger = new Logger(CustomerService.name);

  constructor(
    protected readonly storeRepository: IStoreRepository,
    protected readonly prisma: PrismaMainClient,
    protected readonly marketingClient: IMarketingClient,
  ) {}

  async updateUserInfo(userId: UUID, { phoneNumber }: { phoneNumber: string }) {
    const concreteUpdates = {
      ...(phoneNumber && { phone_number: phoneNumber }),
    };

    await this.prisma.users.update({
      where: { id: userId.uuid },
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
        chatId: user.id,
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

  async anonymizeCustomerAccount(userId: UUID) {
    const anonymousEmail = `deleted+${userId.uuid}@barooders.com`;
    const { email: formerEmail } = await this.prisma.users.findUniqueOrThrow({
      where: { id: userId.uuid },
      select: { email: true },
    });

    this.logger.log('Changing Customer');
    await this.prisma.customer.update({
      where: { authUserId: userId.uuid },
      data: { firstName: '', lastName: '', sellerName: '' },
    });

    this.logger.log('Changing orders');
    await this.prisma.order.updateMany({
      where: { customerId: userId.uuid },
      data: { customerEmail: anonymousEmail },
    });

    this.logger.log('Changing paymentAccounts');
    await this.prisma.paymentAccounts.updateMany({
      where: { customerId: userId.uuid },
      data: { email: anonymousEmail },
    });

    this.logger.log('Anonymize in Shopify');
    await this.storeRepository.anonymizeCustomer(userId, anonymousEmail);

    if (formerEmail) {
      this.logger.log('Deletion request in Klaviyo');
      await this.marketingClient.deleteProfile(formerEmail);
    }

    this.logger.log('Change user email in users');
    await this.prisma.users.update({
      where: { id: userId.uuid },
      data: { email: anonymousEmail },
    });
  }
}
