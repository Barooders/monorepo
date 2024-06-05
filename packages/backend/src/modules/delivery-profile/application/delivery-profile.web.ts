import { Controller, Get, Param } from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

import { DeliveryProfileService } from '../domain/delivery-profile.service';

@Controller(routesV1.version)
export class DeliveryProfileController {
  constructor(private deliveryProfileService: DeliveryProfileService) {}

  @Get(routesV1.deliveryProfile.variant)
  async getProductDeliveryProfile(
    @Param('variantInternalId')
    variantInternalId: string,
  ) {
    return await this.deliveryProfileService.fetchEligibleProductVariantDeliveryProfile(
      variantInternalId,
    );
  }
}
