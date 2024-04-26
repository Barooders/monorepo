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
  contextOptions: { abortOnError: false },
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const bootstrap = async () => {
  let app;
  try {
    app = await bootstraper.init();

    await app.init();
    app.useLogger(app.get(LoggerService));

    initSentry(SentryContext.JOB);

    await bootstraper.boot();

    // Wait for 10 seconds to make sure logs are sent to New Relic
    await sleep(10000);

    await app.close();
  } catch (e) {
    const parsedError = e as { message?: string };
    const errorMessage = parsedError?.message ?? 'Unknown error';
    await sendSlackMessage(
      envConfig.externalServices.slack.errorSlackChannelId,
      `💥 Global error occured in console :

${errorMessage}`,
    );
    // eslint-disable-next-line no-console
    console.error(e);

    // Wait for 10 seconds to make sure logs are sent to New Relic
    await sleep(10000);

    process.exit(1);
  }
};

void bootstrap();
