// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { getDefaultConfig } from '@/config/sentry';
import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_DISABLE_APM !== 'disabled') {
  console.log('Enabled Sentry for edge.');
  Sentry.init(getDefaultConfig());
}
