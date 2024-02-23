import envConfig from './env/env.config';

export const appConfig = {
  jwtSecret: envConfig.appJwtSecret,
  loginJwtSecret: envConfig.loginJwtSecret,
};

export const MINIMAL_COMMISSION_RATE = 30;
