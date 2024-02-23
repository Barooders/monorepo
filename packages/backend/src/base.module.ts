import envConfig from '@config/env/env.config';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { Module } from '@nestjs/common';
import { UnleashModule } from 'nestjs-unleash';

@Module({
  imports: [
    SharedLoggerModule,
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
