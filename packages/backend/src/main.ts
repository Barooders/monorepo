import 'dotenv.config';

import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { initSentry, SentryContext } from '@libs/infrastructure/sentry';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { initClients } from '@libs/application/instrumentation/newrelic.config';

initClients();

declare global {
  // It fixes an issue with Prisma BigInt parsing with typescript
  // Ref: https://github.com/prisma/studio/issues/614#issuecomment-1374116622
  interface BigInt {
    toJSON(): string;
  }
}

async function bootstrap() {
  BigInt.prototype.toJSON = function (): string {
    return this.toString();
  };

  const app: NestExpressApplication = await NestFactory.create(AppModule, {
    rawBody: true,
    bufferLogs: true,
  });

  const prismaService = app.get(PrismaMainClient);
  await prismaService.enableShutdownHooks(app);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(app.get(LoggerService));
  app.useBodyParser('json', { limit: '10mb' });
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Barooders Backend')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  initSentry(SentryContext.WEB);

  // RequestHandler creates a separate execution context, so that all
  // transactions/spans/breadcrumbs are isolated across requests
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());

  await app.listen(process.env.PORT || 3000);
}

void bootstrap();
