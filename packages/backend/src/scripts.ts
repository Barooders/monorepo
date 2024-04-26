import 'dotenv.config';

import { shutDownNewRelic } from '@libs/application/instrumentation/newrelic.config';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { BootstrapConsole } from 'nestjs-console';
import { ScriptsModule } from './scripts.module';

const bootstraper = new BootstrapConsole({
  module: ScriptsModule,
  useDecorators: true,
});

const bootstrap = async () => {
  const app = await bootstraper.init();

  await app.init();
  app.useLogger(app.get(LoggerService));

  await bootstraper.boot();
  await app.close();

  shutDownNewRelic();
};

void bootstrap();
