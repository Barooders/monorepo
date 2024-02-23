import production from './production';
import staging from './staging';
import test from './test';

const DEFAULT_ENV = 'staging';

const envConfig = {
  production,
  staging,
  test,
  local: staging,
};

const getEnvConfig = () => {
  if (
    !process.env.NEXT_PUBLIC_BAROODERS_ENV ||
    !envConfig[process.env.NEXT_PUBLIC_BAROODERS_ENV]
  )
    return envConfig[DEFAULT_ENV];

  return envConfig[process.env.NEXT_PUBLIC_BAROODERS_ENV];
};

export default getEnvConfig();
