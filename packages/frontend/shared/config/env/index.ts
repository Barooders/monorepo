import production from './production';
import staging from './staging';
import test from './test';
import { EnvType } from './types';

const DEFAULT_ENV = 'staging';

const envConfigByEnvName: { [envName: string]: EnvType } = {
  production,
  staging,
  test,
  local: staging,
};

const getEnvConfig = () => {
  if (
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    !process.env.NEXT_PUBLIC_BAROODERS_ENV ||
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    !envConfigByEnvName[process.env.NEXT_PUBLIC_BAROODERS_ENV]
  )
    return envConfigByEnvName[DEFAULT_ENV];

  return envConfigByEnvName[process.env.NEXT_PUBLIC_BAROODERS_ENV];
};

const envConfig = getEnvConfig();

export default envConfig;
