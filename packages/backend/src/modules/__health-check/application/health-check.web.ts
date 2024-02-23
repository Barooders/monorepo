import { Controller, Get, HttpCode } from '@nestjs/common';

import { routesV1 } from '@config/routes.config';

@Controller(routesV1.version)
export class HealthCheckController {
  @Get(routesV1.internal.heartbeat)
  @HttpCode(200)
  beat(): string {
    return 'OK';
  }
}
