'use client';

import SentryExample from '@/components/pages/SentryExample';
import useSentry from '@/hooks/useSentry';

const SentryExamplePage = () => {
  const sentry = useSentry();
  return <SentryExample sentryInstance={sentry} />;
};

export default SentryExamplePage;
