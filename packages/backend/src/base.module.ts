import envConfig from '@config/env/env.config';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UnleashModule } from 'nestjs-unleash';

@Module({
  imports: [
    SharedLoggerModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    CacheModule.register({ isGlobal: true }),
    UnleashModule.forRoot({
      url: 'https://barooders-unleash-fd37f3ccbfac.herokuapp.com//api/client',
      appName: 'default',
      instanceId: 'barooders-backend',
      http: {
        headers: {
          Authorization: envConfig.unleashServerApiToken,
        },
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class BaseModule {}
