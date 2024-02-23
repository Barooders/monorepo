import SentryExample from '@/components/pages/SentryExample';
import * as Sentry from '@sentry/nextjs';

const SentryExamplePage = () => <SentryExample sentryInstance={Sentry} />;

export default SentryExamplePage;
