import { RecursivePartial } from '@libs/types/recursive-partial.type';
import { merge } from 'lodash';
import { envName } from '../env/env.config';
import { Environments } from '../env/types';
import { AllBaseVendorsConfig } from './types';
import { baseVendorConfig } from './vendor.config.base';
import { localVendorConfig } from './vendor.config.local';
import { prodVendorConfig } from './vendor.config.prod';
import { stagingVendorConfig } from './vendor.config.staging';

type EnvironmentsConfig = {
  [key in Environments]: RecursivePartial<AllBaseVendorsConfig>;
};

const vendorConfigByEnv: EnvironmentsConfig = {
  [Environments.PRODUCTION]: prodVendorConfig,
  [Environments.STAGING]: stagingVendorConfig,
  [Environments.LOCAL]: localVendorConfig,
};

export const vendorConfig: AllBaseVendorsConfig = merge(
  baseVendorConfig,
  vendorConfigByEnv[envName as Environments],
) as AllBaseVendorsConfig;
