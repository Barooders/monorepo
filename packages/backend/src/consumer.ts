import 'dotenv.config';

import envConfig from '@config/env/env.config';
import { initClients } from '@libs/application/instrumentation/newrelic.config';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { SentryContext, initSentry } from '@libs/infrastructure/sentry';
import { sendSlackMessage } from '@libs/infrastructure/slack/slack.base.client';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { ConsumerModule } from './consumer.module';

initClients();

const bootstrap = async () => {
  try {
    const app = await NestFactory.create(ConsumerModule, {
      abortOnError: false,
    });

    initSentry(SentryContext.CONSUMER);
    app.useLogger(app.get(LoggerService));
    app.use(Sentry.Handlers.requestHandler());
    app.use(Sentry.Handlers.tracingHandler());

    await app.listen(process.env.PORT || 3000);
  } catch (e) {
    const parsedError = e as { message?: string };
    const errorMessage = parsedError?.message ?? 'Unknown error';
    await sendSlackMessage(
      envConfig.externalServices.slack.errorSlackChannelId,
      `💥 Global error occured in consumer:

${errorMessage}`,
    );
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  }
};

void bootstrap();
