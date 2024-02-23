import { get } from 'env-var';
import local from './local.secret';
import staging from './staging.secret';
import production from './prod.secret';
import { EnvConfigType, Environments } from './types';

const baroodersEnv = get('BAROODERS_ENV').required().asString() as Environments;

export const envName = Object.values(Environments).includes(baroodersEnv)
  ? baroodersEnv
  : Environments.STAGING;

export const envConfigs: Record<Environments, EnvConfigType> = {
  [Environments.LOCAL]: local,
  [Environments.STAGING]: staging,
  [Environments.PRODUCTION]: production,
};

const envConfig = envConfigs[envName];

export default envConfig;
