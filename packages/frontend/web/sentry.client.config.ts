// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import { getClientConfig } from '@/config/sentry';
import * as Sentry from '@sentry/nextjs';

if (process.env.NEXT_PUBLIC_DISABLE_APM !== 'disabled') {
  console.log('Enabled Sentry for client.');
  Sentry.init(getClientConfig());
}
