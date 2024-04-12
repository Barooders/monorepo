import { get } from 'env-var';
import localCronConfig from './local.cron';
import localPublicConfig from './local.public';
import localSecretConfig from './local.secret';
import productionCronConfig from './prod.cron';
import productionPublicConfig from './prod.public';
import productionSecretConfig from './prod.secret';
import stagingCronConfig from './staging.cron';
import stagingPublicConfig from './staging.public';
import stagingSecretConfig from './staging.secret';
import { EnvConfig, Environments } from './types';

const baroodersEnv = get('BAROODERS_ENV').required().asString() as Environments;

export const envName = Object.values(Environments).includes(baroodersEnv)
  ? baroodersEnv
  : Environments.STAGING;

export const envConfigs: Record<Environments, EnvConfig> = {
  [Environments.LOCAL]: {
    ...localPublicConfig,
    ...localSecretConfig,
    ...localCronConfig,
  },
  [Environments.STAGING]: {
    ...stagingPublicConfig,
    ...stagingSecretConfig,
    ...stagingCronConfig,
  },
  [Environments.PRODUCTION]: {
    ...productionPublicConfig,
    ...productionSecretConfig,
    ...productionCronConfig,
  },
};

const envConfig = envConfigs[envName];

export default envConfig;
