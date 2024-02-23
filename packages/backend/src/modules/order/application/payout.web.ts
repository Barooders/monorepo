import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException as HttpNotFoundException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';
import { NotFoundException } from '@libs/domain/exceptions';
import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { NoCompletePaymentAccountException } from '@modules/customer/domain/payment-account-provider.service';
import { AuthGuard } from '@nestjs/passport';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Commission, CommissionService } from '../domain/commission.service';
import {
  OrderValidation,
  OrderValidationService,
} from '../domain/order-validation.service';
import { PayoutService } from '../domain/payout.service';

class PayoutInputQuery {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The Shopify id of the order line',
  })
  orderLineShopifyId!: string;
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
  ) {}

  @Get(routesV1.invoice.previewPayout)
  @UseGuards(AuthGuard('header-api-key'))
  async previewPayout(
    @Query()
    { orderLineShopifyId }: PreviewPayoutInputQuery,
  ): Promise<{ commission: Commission; validation: OrderValidation }> {
    try {
      const { id, order } = await this.prisma.orderLines.findUniqueOrThrow({
        where: {
          shopifyId: orderLineShopifyId,
        },
        include: {
          order: true,
        },
      });
      const commission = await this.commissionService.getCommissionByOrderLine(
        id,
      );
      const validation = await this.orderValidationService.isOrderValid(
        order.id,
      );

      return {
        commission,
        validation,
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
    { orderLineShopifyId }: PayoutInputQuery,
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

      await this.payoutService.executePayoutForOrderLine(id, vendorId, author);
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
