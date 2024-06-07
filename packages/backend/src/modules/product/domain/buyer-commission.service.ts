import {
  COMMISSION_DESCRIPTION,
  COMMISSION_FEATURED_IMAGE_URL,
  COMMISSION_NAME,
  COMMISSION_TYPE,
  COMMISSION_VENDOR,
} from '@libs/domain/constants/commission-product.constants';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Amount, URL } from '@libs/domain/value-objects';
import { toCents } from '@libs/helpers/currency';
import { jsonStringify } from '@libs/helpers/json';
import { Injectable, Logger } from '@nestjs/common';
import { first } from 'lodash';
import { ProductNotFound, VariantNotFound } from './ports/exceptions';
import { IStoreClient } from './ports/store.client';
import { VariantStoreId } from './value-objects/variant-store-id.value-object';

interface CommissionParams {
  threshold: number;
  // Flat money value
  flat: number;
  // Percentage value (0.00 to 1.00)
  variable: number;
}

@Injectable()
export class BuyerCommissionService {
  private readonly logger: Logger = new Logger(BuyerCommissionService.name);

  constructor(
    private prisma: PrismaMainClient,
    private storeClient: IStoreClient,
  ) {}

  computeLineItemCommission(
    lineItemCost: number,
    buyerCommissionRate: number,
  ): number {
    const { flat, variable } =
      this.computeLineItemCommissionParams(lineItemCost);

    return (lineItemCost * variable + flat) * (buyerCommissionRate / 100);
  }

  async createCommissionProduct(
    singleCartLineInternalId: string,
  ): Promise<VariantStoreId | null> {
    const cartLine = await this.prisma.productVariant.findUniqueOrThrow({
      where: { id: singleCartLineInternalId },
      include: { product: { select: { vendor: true } } },
    });

    const amount = new Amount({
      amountInCents: Number(cartLine.priceInCents),
    });
    const { vendor } = cartLine.product;

    const cartCommissionCost = this.computeLineItemCommission(
      amount.amount,
      vendor.buyerCommissionRate,
    );

    const cartLineAmount = new Amount({
      amountInCents: toCents(cartCommissionCost),
    });

    try {
      return await this.storeClient.createCommissionProduct({
        title: COMMISSION_NAME,
        description: COMMISSION_DESCRIPTION,
        vendor: COMMISSION_VENDOR,
        productType: COMMISSION_TYPE,
        featuredImgSrc: new URL({ url: COMMISSION_FEATURED_IMAGE_URL }),
        variants: [
          {
            price: cartLineAmount,
          },
        ],
      });
    } catch (err) {
      this.logger.error((err as Error)?.message, err);

      return null;
    }
  }

  async createAndPublishCommissionProduct(
    singleCartLineInternalId: string,
  ): Promise<VariantStoreId> {
    const commissionProduct = await this.createCommissionProduct(
      singleCartLineInternalId,
    );
    if (!commissionProduct) {
      throw new Error('Could not create commission product in store');
    }

    return commissionProduct;
  }

  async getVendorIsProThenComputeLineItemCommission(
    amount: number,
    vendor: string,
  ): Promise<number> {
    const hasVendorName = vendor !== '';

    if (!hasVendorName) this.logger.error('Empty vendor name');

    const buyerCommissionRate = hasVendorName
      ? await this.getBuyerCommissionRate(vendor)
      : 100;

    const lineItemCommissionCost = this.computeLineItemCommission(
      amount,
      buyerCommissionRate,
    );

    return lineItemCommissionCost;
  }

  async getCommissionByProduct(
    productHandle?: string,
    productInternalId?: string,
    variantInternalId?: string,
  ): Promise<number> {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!productHandle && !productInternalId) {
      throw new Error('Need id or handle to find product');
    }

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const productWhereClause = productInternalId
      ? { id: productInternalId }
      : { handle: productHandle };

    const product = await this.prisma.product.findUnique({
      where: productWhereClause,
      include: {
        vendor: true,
        variants: true,
      },
    });

    if (!product) {
      throw new ProductNotFound(jsonStringify(productWhereClause, 2));
    }

    const variant =
      product.variants.find((variant) =>
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        variantInternalId
          ? variant.id === variantInternalId
          : variant.quantity > 0,
      ) ?? first(product.variants);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!variant?.priceInCents) {
      throw new VariantNotFound(product.id, variantInternalId ?? 'None');
    }

    const vendorName = product.vendor?.sellerName;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const buyerCommissionRate = vendorName
      ? await this.getBuyerCommissionRate(vendorName)
      : 100;

    const lineItemCommissionCost = this.computeLineItemCommission(
      Math.round(Number(variant.priceInCents) / 100),
      buyerCommissionRate,
    );

    return lineItemCommissionCost;
  }

  private computeLineItemCommissionParams(
    lineItemCost: number,
  ): CommissionParams {
    const commissionFeeList: CommissionParams[] = [
      {
        threshold: 200,
        flat: 1,
        variable: 0.09,
      },
      {
        threshold: 500,
        flat: 1,
        variable: 0.08,
      },
      {
        threshold: 1000,
        flat: 11,
        variable: 0.06,
      },
      {
        threshold: 2000,
        flat: 41,
        variable: 0.03,
      },
      {
        threshold: 3000,
        flat: 61,
        variable: 0.02,
      },
      {
        flat: 91,
        variable: 0.01,
        threshold: Infinity,
      },
    ];

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return commissionFeeList.find(
      (commissionFee) => lineItemCost < commissionFee.threshold,
    )!;
  }

  private async getBuyerCommissionRate(sellerName: string): Promise<number> {
    const { buyerCommissionRate } = await this.prisma.customer.findFirstOrThrow(
      {
        where: {
          sellerName,
        },
        select: {
          buyerCommissionRate: true,
        },
      },
    );

    return buyerCommissionRate;
  }
}
