import { BullModuleOptions } from '@nestjs/bull';
import { get } from 'env-var';

export const getRedisConfig = async (): Promise<BullModuleOptions> => ({
  redis: get('REDIS_URL').required().asString(),
});
