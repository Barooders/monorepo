import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import {
  IStoreClient,
  ProductDeliveryProfile,
} from '@modules/delivery-profile/domain/ports/store.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MedusaClient implements IStoreClient {
  constructor(private prisma: PrismaMainClient) {}

  async getProductShippingProfile({
    uuid: _variantInternalId,
  }: UUID): Promise<ProductDeliveryProfile> {
    throw new Error('Method not implemented.');
  }
}
