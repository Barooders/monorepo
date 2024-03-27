import { MINIMAL_COMMISSION_RATE } from '@config/app.config';
import {
  CommissionRuleType,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { jsonStringify } from '@libs/helpers/json';
import {
  ICommissionRepository,
  ParsedCommissionRule,
} from '@modules/product/domain/ports/commission.repository';
import { Injectable, Logger } from '@nestjs/common';
import { BuyerCommissionService } from './buyer-commission.service';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IStoreClient, ProductVariant } from './ports/store.client';

export interface Commission {
  variantPrice: number;
  variantDiscount: number;
  vendorCommission: number;
  vendorShipping: number;
  buyerCommission: number;
}

export enum CriteriaType {
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  PRICE_RANGE = 'PRICE_RANGE',
}

export enum RuleType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
  MAX_AMOUNT = 'MAX_AMOUNT',
}

export interface SaveCommissionInput {
  orderLineId: string;
  productType: string;
  vendorId: string | null;
  priceInCents: number;
  discountInCents: number;
  orderStoreId: string;
}

@Injectable()
export class CommissionService {
  private readonly logger: Logger = new Logger(CommissionService.name);

  constructor(
    private readonly storeClient: IStoreClient,
    private prisma: PrismaMainClient,
    private buyerCommissionService: BuyerCommissionService,
    private internalNotificationClient: IInternalNotificationClient,
    private commissionRepository: ICommissionRepository,
  ) {}

  async getCommissionByOrderLine(orderLineId: string): Promise<Commission> {
    const {
      productType,
      vendorId,
      priceInCents,
      discountInCents,
      order,
      vendorCommission,
      vendorShipping,
      buyerCommission,
    } = await this.prisma.orderLines.findUniqueOrThrow({
      where: {
        id: orderLineId,
      },
      include: {
        order: true,
      },
    });

    if (
      vendorCommission !== null &&
      vendorShipping !== null &&
      buyerCommission !== null
    ) {
      return {
        variantPrice: priceInCents / 100,
        variantDiscount: discountInCents / 100,
        vendorCommission,
        vendorShipping,
        buyerCommission,
      };
    }

    this.logger.warn(
      `Commission not found for order line ${orderLineId}, computing it now`,
    );

    return await this.computeAndSaveCommission({
      orderLineId,
      productType,
      vendorId,
      priceInCents,
      discountInCents,
      orderStoreId: order.shopifyId,
    });
  }

  async computeAndSaveCommission({
    vendorId,
    orderLineId,
    priceInCents,
    discountInCents,
    productType,
    orderStoreId,
  }: SaveCommissionInput): Promise<Commission> {
    if (!vendorId)
      throw new Error(
        `Cannot compute commission for order line ${orderLineId} because it has no vendor id`,
      );

    const isFreeShipping =
      await this.storeClient.isHandDeliveryOrder(orderStoreId);

    const commission = await this.getVendorCommission(
      {
        productType,
        price: priceInCents / 100,
        discount: discountInCents / 100,
        vendorId,
      },
      { isFreeShipping },
    );

    await this.prisma.orderLines.update({
      where: { id: orderLineId },
      data: {
        vendorCommission: commission.vendorCommission,
        vendorShipping: commission.vendorShipping,
        buyerCommission: commission.buyerCommission,
      },
    });

    return commission;
  }

  cleanOldCommissions = this.storeClient.cleanOldCommissions;

  private async getVendorCommission(
    { productType, vendorId, price, discount }: ProductVariant,
    options: { isFreeShipping?: boolean } = {},
  ): Promise<Commission> {
    const discountedPrice = price - discount;
    const { buyerCommissionRate, hasOwnShipping, sellerName } =
      await this.commissionRepository.getVendorCommissionConfigFromId(vendorId);

    const commissionRules =
      await this.commissionRepository.findRulesByVendorId(vendorId);
    const hasCommissionRules = commissionRules.some(
      ({ type }) => type === CommissionRuleType.VENDOR_COMMISSION,
    );
    const hasShippingRules = commissionRules.some(
      ({ type }) => type === CommissionRuleType.VENDOR_SHIPPING,
    );

    if (!hasCommissionRules && buyerCommissionRate < MINIMAL_COMMISSION_RATE) {
      const message = `Vendor ${sellerName} has a bad commission configuration: ${jsonStringify(
        { buyerCommissionRate, hasCommissionRules },
      )}`;

      await this.internalNotificationClient.sendErrorNotification(message);
      // We dont want to throw an error here because we can't change buyerCommissionRate for this order
      // as customer already paid for it so buyerCommission would be wrong in OrderLines table
    }

    if (hasOwnShipping !== hasShippingRules) {
      const message = `Vendor ${sellerName} has a bad shipping configuration: ${jsonStringify(
        {
          hasOwnShipping,
          hasShippingRules,
        },
      )}`;

      await this.internalNotificationClient.sendErrorNotification(message);
      throw new Error(message);
    }

    const getValue = (type: CommissionRuleType) => {
      const matchingRule = this.getMatchingRule(
        commissionRules.filter(({ type: ruleType }) => ruleType === type),
        { price: discountedPrice, productType },
      );
      if (!matchingRule) return 0;

      const computedValue = matchingRule.rules.reduce(
        (acc: number, { type, value }) => {
          switch (type) {
            case RuleType.FIXED:
              return acc + Number(value);
            case RuleType.PERCENTAGE:
              return acc + (discountedPrice * Number(value)) / 100;
            case RuleType.MAX_AMOUNT:
              return acc;
            default:
              throw new Error(`Unknown commission rule type: ${type}`);
          }
        },
        0,
      );
      const maxLimit = matchingRule.rules.find(
        ({ type }) => type === RuleType.MAX_AMOUNT,
      )?.value;

      return maxLimit
        ? Math.min(computedValue, Number(maxLimit))
        : computedValue;
    };

    return {
      variantPrice: price,
      variantDiscount: discount,
      vendorCommission: -1 * getValue(CommissionRuleType.VENDOR_COMMISSION),
      vendorShipping:
        !options.isFreeShipping && hasOwnShipping
          ? getValue(CommissionRuleType.VENDOR_SHIPPING)
          : 0,
      buyerCommission: this.buyerCommissionService.computeLineItemCommission(
        price,
        buyerCommissionRate,
      ),
    };
  }

  private getMatchingRule(
    commissionRules: ParsedCommissionRule[],
    { price, productType }: { price: number; productType: string },
  ): ParsedCommissionRule | undefined {
    return commissionRules
      .sort((a, b) => a.priority - b.priority)
      .find(({ criteria }) => {
        if (!criteria) return true;

        return criteria.every(({ type, value }) => {
          switch (type) {
            case CriteriaType.PRODUCT_TYPE:
              if (!Array.isArray(value))
                throw new Error(
                  `Value is not an array for PRODUCT_TYPE criteria: ${jsonStringify(
                    value,
                  )}`,
                );
              return value.includes(productType);
            case CriteriaType.PRICE_RANGE:
              if (!Array.isArray(value) || value.length !== 2)
                throw new Error(
                  `Value is not a valid range for PRICE_RANGE criteria: ${jsonStringify(
                    value,
                  )}`,
                );
              const min = Number(value[0]);
              const max = Number(value[1]);
              if (isNaN(min) || isNaN(max) || min > max)
                throw new Error(
                  `Min and max are not valid for PRICE_RANGE criteria: ${jsonStringify(
                    value,
                  )}`,
                );
              return price >= min && price <= max;
            default:
              throw new Error(`Unknown criteria type: ${type}`);
          }
        });
      });
  }
}
