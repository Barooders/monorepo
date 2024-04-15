import { envName } from '@config/env/env-name.config';
import { RecursivePartial } from '@libs/types/recursive-partial.type';
import { merge } from 'lodash';
import { Environments } from '../env/types';
import { AllVendorsConfigInterface } from './types';
import { baseVendorConfig } from './vendor.config.base';
import { localVendorConfig } from './vendor.config.local';
import { prodVendorConfig } from './vendor.config.prod';
import { stagingVendorConfig } from './vendor.config.staging';

type EnvironmentsConfig = {
  [key in Environments]: RecursivePartial<AllVendorsConfigInterface>;
};

const vendorConfigByEnv: EnvironmentsConfig = {
  [Environments.PRODUCTION]: prodVendorConfig,
  [Environments.STAGING]: stagingVendorConfig,
  [Environments.LOCAL]: localVendorConfig,
};

export const vendorConfig: AllVendorsConfigInterface = merge(
  baseVendorConfig,
  vendorConfigByEnv[envName],
) as AllVendorsConfigInterface;
