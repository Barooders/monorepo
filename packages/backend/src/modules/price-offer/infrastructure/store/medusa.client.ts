import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Amount, UUID, ValueDate } from '@libs/domain/value-objects';
import { readableCode } from '@libs/helpers/safe-id';
import { medusaClient } from '@libs/infrastructure/medusa/client';
import {
  AdminCreateCondition,
  AllocationType,
  DiscountConditionOperator,
  DiscountRuleType,
} from '@medusajs/medusa';
import { IStoreClient } from '@modules/price-offer/domain/ports/store.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MedusaClient implements IStoreClient {
  constructor(protected readonly prisma: PrismaMainClient) {}

  // TODO: handle user id
  async createDiscountCode(
    userId: UUID,
    limitDate: ValueDate,
    amountOffProduct: Amount,
    productId: UUID,
    productVariantId?: UUID | undefined,
  ): Promise<{ discountCode: string }> {
    const code = readableCode();

    const conditions: AdminCreateCondition[] = [];
    if (productId !== undefined) {
      const { medusaId } = await this.prisma.product.findUniqueOrThrow({
        where: { id: productId.uuid },
        select: { medusaId: true },
      });

      if (medusaId === null) {
        throw new Error(`Product ${productId.uuid} not found in Medusa`);
      }

      conditions.push({
        operator: DiscountConditionOperator.IN,
        products: [medusaId],
      });
    }

    if (productVariantId !== undefined) {
      const {
        product: { medusaId },
      } = await this.prisma.productVariant.findUniqueOrThrow({
        where: { id: productVariantId.uuid },
        select: { product: { select: { medusaId: true } } },
      });

      if (medusaId === null) {
        throw new Error(
          `Product variant ${productVariantId.uuid} not found in Medusa`,
        );
      }

      conditions.push({
        operator: DiscountConditionOperator.IN,
        products: [medusaId],
      });
    }

    const { regions } = await medusaClient.admin.regions.list();

    const { discount } = await medusaClient.admin.discounts.create({
      code,
      is_disabled: false,
      is_dynamic: false,
      rule: {
        type: DiscountRuleType.FIXED,
        value: amountOffProduct.amountInCents,
        allocation: AllocationType.ITEM,
        conditions,
      },
      starts_at: new Date(),
      ends_at: limitDate.date,
      regions: regions.map(({ id }) => id),
      usage_limit: 1,
    });

    return { discountCode: discount.code };
  }
}
