import productionConfig from './production';
import { EnvironmentsType } from './types';

const localConfig: EnvironmentsType = {
  s3: productionConfig.s3,
  authentication: {
    jwtSecret: 'something',
    cookieSecret: 'something',
  },
  database: {
    url: 'postgres://postgres:password@0.0.0.0:2345/barooders-backend',
    ssl: false,
  },
  redis: {
    url: undefined,
  },
  cors: ['http://localhost:8000', 'http://localhost:7001'],
  sendgrid: {
    apiKey: 'fake',
    from: 'outdoor@barooders.com',
  },
};

export default localConfig;
