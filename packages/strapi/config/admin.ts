import envConfig from '../config/variables';

export default () => ({
  auth: {
    secret: envConfig.adminJWTSecret,
  },
  apiToken: {
    salt: envConfig.apiTokenSalt,
  },
});
