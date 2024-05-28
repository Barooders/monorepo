import { BullModuleOptions } from '@nestjs/bull';
import { get } from 'env-var';

export const getRedisConfig = async (): Promise<BullModuleOptions> => {
  const connexionString = get('REDIS_URL').required().asString();
  const parsedConnexionString = connexionString.match(
    /rediss{0,1}:\/\/(.*):(.*)@(.*):(.*)/,
  );

  if (!parsedConnexionString) {
    throw new Error('Invalid REDIS_URL');
  }

  return {
    redis: {
      host: parsedConnexionString[3],
      port: parseInt(parsedConnexionString[4]),
      username: parsedConnexionString[1],
      password: parsedConnexionString[2],
      ...(connexionString.includes('rediss://') && {
        tls: { rejectUnauthorized: false },
      }),
    },
  };
};
