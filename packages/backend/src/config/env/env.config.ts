import { get } from 'env-var';
import localPublicConfig from './local.public';
import localSecretConfig from './local.secret';
import productionPublicConfig from './prod.public';
import productionSecretConfig from './prod.secret';
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
  },
  [Environments.STAGING]: {
    ...stagingPublicConfig,
    ...stagingSecretConfig,
  },
  [Environments.PRODUCTION]: {
    ...productionPublicConfig,
    ...productionSecretConfig,
  },
};

const envConfig = envConfigs[envName];

export default envConfig;
