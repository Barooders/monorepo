import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { IStoreClient, ProductDeliveryProfile } from './ports/store.client';

@Injectable()
export class DeliveryProfileService {
  constructor(private storeClient: IStoreClient) {}

  async fetchEligibleProductVariantDeliveryProfile(
    variantInternalId: UUID,
  ): Promise<ProductDeliveryProfile> {
    return await this.storeClient.getProductShippingProfile(variantInternalId);
  }
}
