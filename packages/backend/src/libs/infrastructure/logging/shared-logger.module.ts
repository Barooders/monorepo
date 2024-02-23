import envConfig from '@config/env/env.config';
import { Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { stdSerializers } from 'pino-http';
import { LoggerService } from './logger.service';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: envConfig.logLevel,
        serializers: {
          req: (req) => {
            const serializedRequest = stdSerializers.req(req);

            return {
              ...serializedRequest,
              headers: {
                ...serializedRequest.headers,
                ...(serializedRequest.headers['authorization']
                  ? { authorization: 'REDACTED' }
                  : {}),
                ...(serializedRequest.headers['x-api-key']
                  ? { 'x-api-key': 'REDACTED' }
                  : {}),
              },
            };
          },
        },
        transport: envConfig.prettyLog
          ? {
              target: 'pino-pretty',
              options: {
                colorize: true,
                singleLine: true,
              },
            }
          : undefined,
      },
    }),
  ],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class SharedLoggerModule {}
