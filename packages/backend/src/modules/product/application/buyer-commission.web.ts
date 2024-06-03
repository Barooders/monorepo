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

import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { BuyerCommissionService } from '../domain/buyer-commission.service';
import { ProductNotFound, VariantNotFound } from '../domain/ports/exceptions';

class CommissionInputDto {
  @ApiProperty({
    description: 'The internal id of a single cart line.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  singleCartLineInternalId!: string;
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

  @ApiProperty({ description: 'The id of a variant.' })
  @IsOptional()
  @Type(() => String)
  variantInternalId?: string;
}

class CreatedCommissionDto {
  @ApiProperty({
    description: 'The medusa id of the created commission product.',
  })
  @IsString()
  @IsOptional()
  variantMedusaId?: string;

  @ApiProperty({
    description: 'The shopify id of the created commission product.',
  })
  @IsNumber()
  @IsOptional()
  variantShopifyId?: number;
}

@Controller(routesV1.version)
export class BuyerCommissionController {
  private readonly logger = new Logger(BuyerCommissionController.name);

  constructor(private buyerCommissionService: BuyerCommissionService) {}

  @ApiResponse({ type: CreatedCommissionDto })
  @Post(routesV1.product.createCommission)
  async createAndPublishCommissionProduct(
    @Body()
    { singleCartLineInternalId }: CommissionInputDto,
  ): Promise<CreatedCommissionDto> {
    const commission =
      await this.buyerCommissionService.createAndPublishCommissionProduct(
        singleCartLineInternalId,
      );

    return {
      variantMedusaId: commission.medusaIdIfExists,
      variantShopifyId: commission.shopifyIdIfExists,
    };
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
    const { productHandle, productInternalId, variantInternalId } =
      productInputDto;

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
