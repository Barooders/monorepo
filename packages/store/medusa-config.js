const { config } = require('dotenv');
try {
  config({ path: '.env' });
} catch (e) {}

const envConfig = require('./dist/config/env/env.config').default;

// CORS when consuming Medusa from admin
const ADMIN_CORS =
  process.env.ADMIN_CORS || 'http://localhost:7000,http://localhost:7001';

// CORS to avoid issues when consuming Medusa from a client
const STORE_CORS = process.env.STORE_CORS || 'http://localhost:8000';

const DATABASE_URL =
  process.env.DATABASE_URL || 'postgres://localhost/medusa-starter-default';

const DATABASE_SCHEMA = process.env.POSTGRES_SCHEMA || 'medusa';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

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
        open: process.env.OPEN_BROWSER !== 'false',
      },
    },
  },
  {
    resolve: `medusa-plugin-sendgrid`,
    options: {
      api_key: process.env.SENDGRID_API_KEY,
      from: process.env.SENDGRID_FROM,
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

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
  store_cors: STORE_CORS,
  database_url: DATABASE_URL,
  admin_cors: ADMIN_CORS,
  database_schema: DATABASE_SCHEMA,
  database_extra: {
    ssl: {
      rejectUnauthorized: process.env.DATABASE_SSL === 'true',
    },
  },
  redis_url: REDIS_URL,
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
