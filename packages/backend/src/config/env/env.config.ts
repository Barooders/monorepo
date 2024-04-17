import { vendorConfig } from '@config/vendor/vendor.config';
import { envName } from './env-name.config';
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

const vendorsToSync = Object.values(vendorConfig).flatMap(
  ({ synchros, slug }) => {
    return synchros.map(({ cron, commandName }) => ({
      cron,
      command: `yarn workspace backend console proVendor ${commandName} ${slug}`,
    }));
  },
);

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

const envConfigWithoutVendorsToSync = envConfigs[envName];

const envConfig = {
  ...envConfigWithoutVendorsToSync,
  cronJobs: [...envConfigWithoutVendorsToSync.cronJobs, ...vendorsToSync],
};

export default envConfig;
