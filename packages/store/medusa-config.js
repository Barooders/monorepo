const envConfig = require(`${__dirname}/dist/config/env/env.config`).default;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
  {
    resolve: `@medusajs/file-local`,
    options: {
      upload_dir: 'uploads',
    },
  },
  {
    resolve: '@medusajs/admin',
    /** @type {import('@medusajs/admin').PluginOptions} */
    options: {
      autoRebuild: true,
      develop: {
        open: true,
      },
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: envConfig.sendgrid.apiKey,
      from: envConfig.sendgrid.from,
    },
  },
  {
    resolve: `medusa-file-s3`,
    options: {
      s3_url: envConfig.s3.s3Url,
      bucket: envConfig.s3.bucket,
      region: envConfig.s3.region,
      access_key_id: envConfig.s3.accessKeyId,
      secret_access_key: envConfig.s3.secretAccessKey,
    },
  },
];

/** @type {import('@medusajs/medusa').ConfigModule["modules"]} */
const modules = {
  /*eventBus: {
    resolve: "@medusajs/event-bus-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },
  cacheService: {
    resolve: "@medusajs/cache-redis",
    options: {
      redisUrl: REDIS_URL
    }
  },*/
};

const DATABASE_SCHEMA = 'medusa';

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: envConfig.authentication.jwtSecret,
  cookie_secret: envConfig.authentication.cookieSecret,
  store_cors: envConfig.cors.join(','),
  database_url: `${envConfig.database.url}?options=-c%20search_path%3D${DATABASE_SCHEMA}`,
  admin_cors: envConfig.cors.join(','),
  database_schema: DATABASE_SCHEMA,
  ...(envConfig.database.ssl
    ? {
        database_extra: {
          ssl: {
            rejectUnauthorized: true,
          },
        },
      }
    : {}),
  ...(envConfig.redis.url ? { redis_url: envConfig.redis.url } : {}),
};

/** @type {import('@medusajs/medusa').ConfigModule["featureFlags"]} */
const featureFlags = {
  product_categories: true,
  tax_inclusive_pricing: true,
};

/** @type {import('@medusajs/medusa').ConfigModule} */
module.exports = {
  projectConfig,
  plugins,
  modules,
  featureFlags,
};
