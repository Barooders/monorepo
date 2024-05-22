import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

import { DeliveryProfileService } from '../domain/delivery-profile.service';

@Controller(routesV1.version)
export class DeliveryProfileController {
  constructor(private deliveryProfileService: DeliveryProfileService) {}

  @Get(routesV1.deliveryProfile.variant)
  async getProductDeliveryProfile(
    @Param('shopifyProductVariantId', new ParseIntPipe())
    shopifyProductVariantId: number,
  ) {
    return await this.deliveryProfileService.fetchEligibleProductVariantDeliveryProfile(
      shopifyProductVariantId,
    );
  }
}
