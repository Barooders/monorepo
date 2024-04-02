import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException as HttpNotFoundException,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';
import { NotFoundException } from '@libs/domain/exceptions';
import {
  PrismaMainClient,
  ShippingSolution,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { Amount as AmountObject } from '@libs/domain/value-objects';
import { NoCompletePaymentAccountException } from '@modules/customer/domain/payment-account-provider.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Commission, CommissionService } from '../domain/commission.service';
import {
  OrderValidation,
  OrderValidationService,
} from '../domain/order-validation.service';
import { PayoutService } from '../domain/payout.service';
import { IStoreClient } from '../domain/ports/store.client';
import {
  Amount,
  BuyerPriceLines,
  DiscountApplication,
} from '../domain/ports/types';

class PayoutInputQuery {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The Shopify id of the order line',
  })
  orderLineShopifyId!: string;

  @IsString()
  @ApiProperty({
    description: 'A comment to store a reason for a price change for example',
    required: false,
  })
  comment?: string;

  @IsInt()
  @ApiProperty({
    description: 'An amount to replace the calculated one',
    required: false,
  })
  @IsOptional()
  amountInCents?: number;
}

class PreviewPayoutInputQuery {
  @IsNotEmpty()
  @ApiProperty({
    description: 'The id of the Shopify order line',
  })
  orderLineShopifyId!: string;
}

@Controller(routesV1.version)
export class PayoutController {
  private readonly logger: Logger = new Logger(PayoutController.name);

  constructor(
    private payoutService: PayoutService,
    private commissionService: CommissionService,
    private orderValidationService: OrderValidationService,
    private prisma: PrismaMainClient,
    private storeClient: IStoreClient,
  ) {}

  @Get(routesV1.invoice.previewPayout)
  @UseGuards(AuthGuard('header-api-key'))
  async previewPayout(
    @Query()
    { orderLineShopifyId }: PreviewPayoutInputQuery,
  ): Promise<{
    orderLine: {
      shippingSolution: ShippingSolution;
    };
    commission: Commission;
    validation: OrderValidation;
    appliedDiscounts: DiscountApplication[];
    orderPriceLines: {
      type: BuyerPriceLines;
      amount: Amount;
    }[];
  }> {
    try {
      const { id, order, shippingSolution } =
        await this.prisma.orderLines.findUniqueOrThrow({
          where: {
            shopifyId: orderLineShopifyId,
          },
          include: {
            order: true,
          },
        });
      const commission =
        await this.commissionService.getCommissionByOrderLine(id);
      const validation = await this.orderValidationService.isOrderValid(
        order.id,
      );
      const appliedDiscounts = await this.storeClient.getAppliedDiscounts(
        order.shopifyId,
      );
      const orderPriceLines = await this.storeClient.getOrderPriceItems(
        order.shopifyId,
      );

      return {
        orderLine: {
          shippingSolution,
        },
        commission,
        validation,
        appliedDiscounts,
        orderPriceLines: orderPriceLines.lines,
      };
    } catch (error: any) {
      if (error instanceof NotFoundException) {
        throw new HttpNotFoundException(error);
      }

      throw new BadRequestException(error);
    }
  }

  @Post(routesV1.invoice.executePayout)
  @UseGuards(AuthGuard('header-api-key'))
  async executePayout(
    @Body()
    { orderLineShopifyId, amountInCents, comment }: PayoutInputQuery,
    @Query()
    { authorId }: { authorId?: string },
  ): Promise<void> {
    try {
      const { id, vendorId } = await this.prisma.orderLines.findUniqueOrThrow({
        where: {
          shopifyId: orderLineShopifyId,
        },
      });

      if (!vendorId) {
        throw new NotFoundException(
          `Cannot payout order line ${orderLineShopifyId} because it has no vendor in database`,
        );
      }

      const author: Author = {
        type: 'admin',
        id: authorId,
      };

      const manualAmount = amountInCents
        ? new AmountObject({ amountInCents })
        : null;

      await this.payoutService.executePayoutForOrderLine(
        id,
        vendorId,
        author,
        manualAmount,
        comment,
      );
    } catch (error: any) {
      if (
        error instanceof NotFoundException ||
        error instanceof NoCompletePaymentAccountException
      ) {
        throw new HttpNotFoundException(error);
      }

      throw new BadRequestException(error);
    }
  }
}
