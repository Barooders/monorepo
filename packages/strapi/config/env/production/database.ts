import { parse } from 'pg-connection-string';
import envConfig from '../../../config/variables';

module.exports = ({ env }) => {
  const config = parse(envConfig.databaseUrl);

  return {
    connection: {
      client: 'postgres',
      connection: {
        host: config.host,
        port: config.port,
        database: config.database,
        user: config.user,
        password: config.password,
        ssl: {
          rejectUnauthorized: false,
        },
        schema: 'strapi',
      },
      debug: env.bool('DATABASE_DEBUG_MODE'),
    },
  };
};
