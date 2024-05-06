import envConfig from '@config/env/env.config';
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

export enum SentryContext {
  WEB = 'WEB',
  CONSUMER = 'CONSUMER',
  JOB = 'JOB',
}

const BACKEND_DSN =
  'https://7e22f977058f4c9ba1633c931a2c37ab@o4504632476172288.ingest.sentry.io/4504872565604352';
const PRO_VENDOR_DSN =
  'https://d88096b57e024b4a88cdb03fc02e9170@o4504632476172288.ingest.sentry.io/4504831929221120';

const dsnByContext = {
  [SentryContext.WEB]: BACKEND_DSN,
  [SentryContext.CONSUMER]: PRO_VENDOR_DSN,
  [SentryContext.JOB]: PRO_VENDOR_DSN,
};

export const initSentry = (context: SentryContext) => {
  Sentry.init({
    dsn: dsnByContext[context],
    tracesSampler: ({ transactionContext: { name } }) => {
      if (name.includes('GET /v1/commission/compute-line-item')) return 0.05;
      if (name.includes('GET /v1/commission/product')) return 0.05;

      if (name.includes('GET /v1/products/:productId')) return 0.005;
      if (name.includes('GET /v1/products/by-handle/:productHandle'))
        return 0.005;

      return 0.1;
    },
    profilesSampleRate: 1.0,
    integrations: [
      new ProfilingIntegration(),
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
    ],
    environment: envConfig.envName,
    enabled: envConfig.isSentryEnabled,
  });
};
