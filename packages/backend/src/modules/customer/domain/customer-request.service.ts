import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { CustomerRequestCreationRequest } from './ports/customer-request';

@Injectable()
export class CustomerRequestService {
  constructor(private prisma: PrismaMainClient) {}

  async createCustomerRequests(
    customerId: UUID,
    requests: CustomerRequestCreationRequest[],
  ) {
    return this.prisma.customerRequest.createMany({
      data: requests.map((request) => ({
        ...request,
        customerId: customerId.uuid,
      })),
    });
  }
}
