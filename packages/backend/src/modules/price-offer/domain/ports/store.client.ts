import { ValueDate, UUID, Amount } from '@libs/domain/value-objects';

export abstract class IStoreClient {
  abstract createDiscountCode(
    userId: UUID,
    limitDate: ValueDate,
    amountOffProduct: Amount,
    productId: UUID,
    productVariantId?: UUID,
  ): Promise<{ discountCode: string }>;
}
