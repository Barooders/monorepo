import stagingConfig from './staging';
import { EnvironmentsType } from './types';

const localConfig: EnvironmentsType = {
  s3: stagingConfig.s3,
  authentication: {
    jwtSecret: 'something',
    cookieSecret: 'something',
  },
  database: {
    url: 'postgres://postgres:password@0.0.0.0:2345/barooders-backend',
    ssl: false,
  },
  redis: {
    url: 'redis://localhost:6379',
  },
  cors: ['http://localhost:8000', 'http://localhost:7001'],
  sendgrid: {
    apiKey: 'fake',
    from: 'outdoor@barooders.com',
  },
};

export default localConfig;
