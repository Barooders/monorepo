const { config } = require('dotenv');
try {
  config({ path: '.env' });
} catch (e) {}
const { DataSource } = require('typeorm');
const { parse } = require('pg-connection-string');

const envConfig = require(`${__dirname}/dist/config/env/env.config`).default;

const plugins = [
  `medusa-fulfillment-manual`,
  `medusa-payment-manual`,
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
  {
    resolve: `medusa-payment-paypal`,
    options: {
      sandbox: envConfig.paypal.isSandbox,
      clientId: envConfig.paypal.clientId,
      clientSecret: envConfig.paypal.clientSecret,
      authWebhookId: envConfig.paypal.authWebhookId,
    },
  },
  {
    resolve: `medusa-payment-stripe`,
    options: {
      api_key: envConfig.stripe.apiKey,
      webhook_secret: envConfig.stripe.webhookSecret,
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
const databaseBaseUrl = process.env.DATABASE_URL ?? envConfig.database.url;
const redisUrl = process.env.REDIS_URL ?? envConfig.redis.url;

const databaseInfo = parse(databaseBaseUrl);
const AppDataSource = new DataSource({
  type: 'postgres',
  port: databaseInfo.port,
  username: databaseInfo.user,
  password: databaseInfo.password,
  database: databaseInfo.database,
  schema: DATABASE_SCHEMA,
  entities: [
    'dist/models/*.js',
    'node_modules/@medusajs/medusa/dist/models/*.js',
  ],
  migrations: [
    'dist/migrations/*.js',
    'node_modules/@medusajs/medusa/dist/migrations/*.js',
  ],
});

/** @type {import('@medusajs/medusa').ConfigModule["projectConfig"]} */
const projectConfig = {
  jwt_secret: envConfig.authentication.jwtSecret,
  cookie_secret: envConfig.authentication.cookieSecret,
  store_cors: envConfig.cors.join(','),
  database_url: `${databaseBaseUrl}?options=-c%20search_path%3D${DATABASE_SCHEMA}`,
  admin_cors: envConfig.cors.join(','),
  database_schema: DATABASE_SCHEMA,
  ...(envConfig.database.ssl
    ? {
        database_extra: {
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : {}),
  ...(redisUrl
    ? {
        redis_url: redisUrl,
        ...(envConfig.redis.tls
          ? { redis_options: { tls: { rejectUnauthorized: false } } }
          : {}),
      }
    : {}),
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
  datasource: AppDataSource,
};
