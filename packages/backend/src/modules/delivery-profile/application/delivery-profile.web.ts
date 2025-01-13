import { Controller, Get, Param } from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

import { UUID } from '@libs/domain/value-objects';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';
import { IsNumber, IsString, ValidateNested } from 'class-validator';
import { DeliveryProfileService } from '../domain/delivery-profile.service';

class DeliveryProfileItemDTO {
  @ApiProperty()
  @IsString()
  name!: string;

  @ApiProperty()
  @IsNumber()
  amount!: number;
}
class ProductDeliveryProfileDTO {
  @ApiProperty({ isArray: true, type: DeliveryProfileItemDTO, required: true })
  @ValidateNested({ each: true })
  options!: DeliveryProfileItemDTO[];
}
@Controller(routesV1.version)
export class DeliveryProfileController {
  constructor(private deliveryProfileService: DeliveryProfileService) {}

  @Get(routesV1.deliveryProfile.variant)
  @ApiResponse({
    type: ProductDeliveryProfileDTO,
  })
  async getProductDeliveryProfile(
    @Param('variantInternalId')
    variantInternalId: string,
  ): Promise<ProductDeliveryProfileDTO> {
    return await this.deliveryProfileService.fetchEligibleProductVariantDeliveryProfile(
      new UUID({ uuid: variantInternalId }),
    );
  }
}
