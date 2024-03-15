import 'dotenv.config';

import envConfig from '@config/env/env.config';
import { initClients } from '@libs/application/instrumentation/newrelic.config';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { SentryContext, initSentry } from '@libs/infrastructure/sentry';
import { sendSlackMessage } from '@libs/infrastructure/slack/slack.base.client';
import { BootstrapConsole } from 'nestjs-console';
import { ConsoleModule } from './console.module';

initClients();

const bootstraper = new BootstrapConsole({
  module: ConsoleModule,
  useDecorators: true,
});

const bootstrap = async () => {
  let app;
  try {
    app = await bootstraper.init();

    await app.init();
    app.useLogger(app.get(LoggerService));

    initSentry(SentryContext.JOB);

    await bootstraper.boot();
    await app.close();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
    await sendSlackMessage(
      envConfig.externalServices.slack.errorSlackChannelId,
      'Global error occured in console, stopping process',
    );

    if (app) await app.close();

    process.exit(1);
  }
};

void bootstrap();
