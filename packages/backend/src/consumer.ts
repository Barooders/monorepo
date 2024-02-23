import 'dotenv.config';

import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { NestFactory } from '@nestjs/core';
import * as Sentry from '@sentry/node';
import { ConsumerModule } from './consumer.module';
import { SentryContext, initSentry } from '@libs/infrastructure/sentry';
import { initClients } from '@libs/application/instrumentation/newrelic.config';

initClients();

async function bootstrap() {
  const app = await NestFactory.create(ConsumerModule, {});

  initSentry(SentryContext.CONSUMER);
  app.useLogger(app.get(LoggerService));
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  await app.listen(process.env.PORT || 3000);
}
void bootstrap();
