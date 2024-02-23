import { BullModuleOptions } from '@nestjs/bull';
import { get } from 'env-var';

export const getRedisConfig = async (): Promise<BullModuleOptions> => {
  const connectionString = get('REDIS_URL').required().asString();
  const parsedConnectionString = connectionString.match(
    /rediss{0,1}:\/\/.*:(.*)@(.*):(.*)/,
  );

  if (!parsedConnectionString) {
    throw new Error('Invalid REDIS_URL');
  }

  return {
    redis: {
      host: parsedConnectionString[2],
      port: parseInt(parsedConnectionString[3]),
      password: parsedConnectionString[1],
      ...(connectionString.includes('rediss://') && {
        tls: { rejectUnauthorized: false },
      }),
    },
  };
};
