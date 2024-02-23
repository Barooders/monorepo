import { SamplingContext } from '@sentry/types';
import * as Sentry from '@sentry/nextjs';

const environment = process.env.NEXT_PUBLIC_BAROODERS_ENV ?? 'local';

export const getDefaultConfig = () => ({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment,
  enabled: process.env.NEXT_PUBLIC_DISABLE_APM !== 'disabled',
  tracesSampler: ({
    transactionContext: { name },
    request,
  }: SamplingContext) => {
    if (request?.url?.includes('onrender.com')) return 1;
    if (environment !== 'production') return 1;
    if (name.includes('/collections/[collectionHandle]')) return 0.02;
    return 0.01;
  },
  debug: false,
});

export const getClientConfig = () => ({
  ...getDefaultConfig(),
  replaysSessionSampleRate: 0.1,
  ignoreErrors: [
    'Loading chunk',
    /^Load failed$/,
    /^Failed to fetch$/,
    'Unreachable hosts',
    'Could not login because',
    'ResizeObserver loop completed with undelivered notifications',
  ],
  integrations: [
    new Sentry.BrowserTracing({
      shouldCreateSpanForRequest: (url: string) => {
        return !url.startsWith(process.env.NEXT_PUBLIC_HASURA_BASE_URL);
      },
    }),
    new Sentry.Replay({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});
