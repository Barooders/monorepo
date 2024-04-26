import { shutDownNewRelic } from '@libs/application/instrumentation/newrelic.config';

export const graceFullyShutdownWithError = () => {
  shutDownNewRelic();
  // eslint-disable-next-line no-process-exit
  process.exit(1);
};
