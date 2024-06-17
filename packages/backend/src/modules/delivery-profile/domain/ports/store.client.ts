import { UUID } from '@libs/domain/value-objects';

export type DeliveryProfileItem = {
  name: string;
  amount: number;
};

export type ProductDeliveryProfile = {
  options: DeliveryProfileItem[];
};

export abstract class IStoreClient {
  abstract getProductShippingProfile(
    variantInternalId: UUID,
  ): Promise<ProductDeliveryProfile>;
}
