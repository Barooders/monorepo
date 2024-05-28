import { BullModuleOptions } from '@nestjs/bull';

export const getRedisConfig = async (): Promise<BullModuleOptions> => {
  // const connexionString = get('REDIS_URL').required().asString();
  // const parsedConnexionString = connexionString.match(
  //   /rediss{0,1}:\/\/(.*):(.*)@(.*):(.*)/,
  // );

  // if (!parsedConnexionString) {
  //   throw new Error('Invalid REDIS_URL');
  // }

  return {
    redis: {
      host: 'localhost',
      port: 6379,
    },
  };
};
