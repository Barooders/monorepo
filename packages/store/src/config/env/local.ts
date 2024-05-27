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
    url: 'redis://default:@0.0.0.0:6379',
    tls: false,
  },
  cors: [
    'http://localhost:8000',
    'http://localhost:7001',
    'http://localhost:3001',
  ],
  sendgrid: {
    apiKey: 'fake',
    from: 'outdoor@barooders.com',
  },
  paypal: stagingConfig.paypal,
  stripe: stagingConfig.stripe,
};

export default localConfig;
