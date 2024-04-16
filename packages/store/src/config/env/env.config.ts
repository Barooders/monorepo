import 'dotenv';
import { get } from 'env-var';
import localConfig from './local';
import productionConfig from './production';
import stagingConfig from './staging';
import { Environments, EnvironmentsType } from './types';

const baroodersEnv = get('BAROODERS_ENV').required().asString() as Environments;

export const envName = Object.values(Environments).includes(baroodersEnv)
  ? baroodersEnv
  : Environments.PRODUCTION;

export const envConfigs: Record<Environments, EnvironmentsType> = {
  [Environments.PRODUCTION]: productionConfig,
  [Environments.STAGING]: stagingConfig,
  [Environments.LOCAL]: localConfig,
};

const envConfig = envConfigs[envName];

export default envConfig;
