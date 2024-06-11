import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
export type DeliveryProfileItem = {
  name: string;
  amount: number;
};

export type ProductDeliveryProfile = {
  options: DeliveryProfileItem[];
};
@Injectable()
export class DeliveryProfileService {
  async fetchEligibleProductVariantDeliveryProfile(
    _variantInternalId: UUID,
  ): Promise<ProductDeliveryProfile> {
    throw new Error('Method not implemented');
  }
}
