import 'dotenv.config';

import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { BootstrapConsole } from 'nestjs-console';
import { ConsoleModule } from './console.module';
import { SentryContext, initSentry } from '@libs/infrastructure/sentry';
import { initClients } from '@libs/application/instrumentation/newrelic.config';

initClients();

const bootstrap = new BootstrapConsole({
  module: ConsoleModule,
  useDecorators: true,
});
void bootstrap.init().then(async (app) => {
  try {
    await app.init();
    app.useLogger(app.get(LoggerService));

    initSentry(SentryContext.JOB);

    await bootstrap.boot();
    await app.close();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    await app.close();
    process.exit(1);
  }
});
