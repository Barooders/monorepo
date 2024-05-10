import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    SharedLoggerModule,
    EventEmitterModule.forRoot({
      wildcard: true,
    }),
    CacheModule.register({ isGlobal: true }),
  ],
  controllers: [],
  providers: [],
})
export class BaseModule {}
