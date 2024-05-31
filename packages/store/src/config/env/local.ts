import stagingConfig from './staging';
import { EnvironmentsType } from './types';

const localConfig: EnvironmentsType = {
  backend: {
    baseUrl: 'http://localhost:3000',
    apiKey: '03115fc60a80b0c095272f082620a3fdabfc45834d59ffe9265a2f75c1ffbd84',
  },
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
    url: '',
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
