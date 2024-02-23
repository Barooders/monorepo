import { Module } from '@nestjs/common';

import { HealthCheckController } from './application/health-check.web';
@Module({
  controllers: [HealthCheckController],
})
export class HealthCheckModule {}
