import local from './secrets/local';
import production from './secrets/production';

const DEFAULT_ENV = 'local';

type EnvType = {
  adminJWTSecret: string;
  apiTokenSalt: string;
  appKeys: string[];
  aws: {
    accessKeyId: string;
    accessSecret: string;
    region: string;
    bucket: string;
  };
  databaseUrl: string;
  jwtSecret: string;
};

const envNameToConfig: { [env: string]: EnvType } = {
  production,
  local,
};

const getEnvConfig = () => {
  if (
    !process.env.NEXT_PUBLIC_BAROODERS_ENV ||
    !envNameToConfig[process.env.NEXT_PUBLIC_BAROODERS_ENV]
  )
    return envNameToConfig[DEFAULT_ENV];

  return envNameToConfig[process.env.NEXT_PUBLIC_BAROODERS_ENV];
};

const envConfig = getEnvConfig();

export default envConfig;
