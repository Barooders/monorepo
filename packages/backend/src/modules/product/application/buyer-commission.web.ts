import {
  Body,
  Controller,
  Get,
  Logger,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
} from 'class-validator';
import { BuyerCommissionService } from '../domain/buyer-commission.service';
import { Commission } from '../domain/ports/commission.entity';
import { ProductNotFound, VariantNotFound } from '../domain/ports/exceptions';

class CommissionInputDto {
  @IsNotEmpty()
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => String)
  @ApiProperty({ required: false, isArray: true, minItems: 1, type: String })
  cartLineIds!: string[];
}

class LineItemInputDto {
  @IsNumberString()
  @ApiProperty({
    description: 'The price amount (Decimal)',
    example: '29.99',
  })
  amount!: number;

  @ApiProperty({ description: 'The product vendor.' })
  vendor!: string;
}

class ProductInputDto {
  @ApiProperty({
    description: 'The handle of a product',
    example: 'vtt-enduro',
  })
  @IsOptional()
  productHandle?: string;

  @ApiProperty({
    description: 'The id of a product',
    example: '73829019283',
  })
  @IsOptional()
  productInternalId?: string;

  @ApiProperty({ description: 'The shopify id of a variant.' })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  variantShopifyId?: number;
}

@Controller(routesV1.version)
export class BuyerCommissionController {
  private readonly logger = new Logger(BuyerCommissionController.name);

  constructor(
    private buyerCommissionService: BuyerCommissionService,
    private prisma: PrismaMainClient,
  ) {}

  @ApiResponse({ type: Commission })
  @Post(routesV1.product.createCommission)
  async createAndPublishCommissionProduct(
    @Body()
    commissionInputDto: CommissionInputDto,
  ) {
    const { cartLineIds } = commissionInputDto;

    return await this.buyerCommissionService.createAndPublishCommissionProduct(
      cartLineIds,
    );
  }

  @Get(routesV1.product.computeLineItemCommission)
  /**
   * It computes a line item (single amount) commission cost and returns it.
   * @returns {Promise<number>} - It returns the commission cost.
   */
  async computeLineItemCommission(
    @Query()
    lineItemInputDto: LineItemInputDto,
  ) {
    this.logger.debug('Calling commission route');
    const { amount, vendor } = lineItemInputDto;

    const commissionCost =
      await this.buyerCommissionService.getVendorIsProThenComputeLineItemCommission(
        amount,
        vendor,
      );

    return commissionCost;
  }

  @Get(routesV1.product.computeProductCommission)
  /**
   * It computes a line item (single amount) commission cost and returns it.
   * @returns {Promise<number>} - It returns the commission cost.
   */
  async computeProductCommission(
    @Query()
    productInputDto: ProductInputDto,
  ) {
    const { productHandle, productInternalId, variantShopifyId } =
      productInputDto;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const variantInternalId = variantShopifyId
      ? (
          await this.prisma.productVariant.findUniqueOrThrow({
            where: {
              shopifyId: variantShopifyId,
            },
            select: {
              id: true,
            },
          })
        ).id
      : undefined;

    try {
      const commissionCost =
        await this.buyerCommissionService.getCommissionByProduct(
          productHandle,
          productInternalId,
          variantInternalId,
        );

      return commissionCost;
    } catch (e: any) {
      if (e instanceof ProductNotFound || e instanceof VariantNotFound) {
        throw new NotFoundException(e);
      }
      throw e;
    }
  }
}
