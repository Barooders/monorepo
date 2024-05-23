import production from './production';
import staging from './staging';
import test from './test';

const DEFAULT_ENV = 'staging';

const envConfigByEnvName = {
  production,
  staging,
  test,
  local: staging,
};

const getEnvConfig = () => {
  if (
    !process.env.NEXT_PUBLIC_BAROODERS_ENV ||
    !envConfigByEnvName[process.env.NEXT_PUBLIC_BAROODERS_ENV]
  )
    return envConfigByEnvName[DEFAULT_ENV];

  return envConfigByEnvName[process.env.NEXT_PUBLIC_BAROODERS_ENV];
};

const envConfig = getEnvConfig();

export default envConfig;
