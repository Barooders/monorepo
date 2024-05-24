import { Prisma, PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';

interface CustomersFindManyInput {
  fields: (keyof Prisma.CustomerSelect)[];
}

@Injectable()
export class CustomerRepository {
  constructor(private prisma: PrismaMainClient) {}

  async getCustomerFromVendorId(vendorId: string) {
    return await this.prisma.customer.findFirst({
      where: { authUserId: vendorId },
      include: { user: true },
    });
  }

  async findMany({ fields }: CustomersFindManyInput) {
    const selectedFields: Prisma.CustomerSelect = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fields.forEach((field) => (selectedFields[field] = true));

    const select =
      Object.keys(selectedFields).length > 0 ? selectedFields : undefined;

    const customers = await this.prisma.customer.findMany({ select });

    return customers;
  }
}
