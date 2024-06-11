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
    uuid: variantInternalId,
  }: UUID): Promise<ProductDeliveryProfile> {
    const {
      product: { medusaId: productMedusaId },
    } = await this.prisma.productVariant.findUniqueOrThrow({
      where: {
        id: variantInternalId,
      },
      select: {
        product: {
          select: {
            medusaId: true,
          },
        },
      },
    });

    if (productMedusaId === null)
      throw new Error('Medusa product ID not found');

    return {
      options: [
        {
          name: 'toto',
          amount: 12,
        },
      ],
    };
  }
}
