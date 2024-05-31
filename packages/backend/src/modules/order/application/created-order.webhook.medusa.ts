import { routesV2 } from '@config/routes.config';
import { jsonStringify } from '@libs/helpers/json';
import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller(routesV2.version)
export class CreatedOrderWebhookMedusaController {
  private readonly logger = new Logger(
    CreatedOrderWebhookMedusaController.name,
  );

  @Post(routesV2.order.onCreatedEvent)
  @UseGuards(AuthGuard('header-api-key'))
  async handleCreatedOrderEvent(@Body() orderData: unknown): Promise<void> {
    this.logger.log(`Received order data: ${jsonStringify(orderData)}`);
  }
}
