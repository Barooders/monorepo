import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { medusaClient } from '@libs/infrastructure/medusa/client';
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

    const product = await medusaClient.admin.products.retrieve(productMedusaId);
    const profile = await medusaClient.admin.shippingProfiles.retrieve(
      product.product.profile_id,
    );

    const firstShippingOption = profile.shipping_profile.shipping_options;

    return {
      options: [
        {
          name: jsonStringify(firstShippingOption),
          amount: 10,
        },
      ],
    };
  }
}
