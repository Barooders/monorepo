// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { getDefaultConfig } from '@/config/sentry';
import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_DISABLE_APM !== 'disabled') {
  console.log('Enabled Sentry for server.');
  Sentry.init(getDefaultConfig());
}
