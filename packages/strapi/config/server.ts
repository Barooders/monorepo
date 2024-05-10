import envConfig from '../config/variables';

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: envConfig.appKeys,
  },
});
