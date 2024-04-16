import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { ProductModule } from '@modules/product/product.module';
import { SyncProductsInMedusaCLI } from '@modules/scripts/create-medusa-products.cli';
import { ConsoleModule as NestConsoleModule } from 'nestjs-console';
import { BaseModule } from './base.module';

@Module({
  imports: [
    SharedLoggerModule,
    PrismaModule,
    ProductModule,
    NestConsoleModule,
    BaseModule,
  ],
  providers: [SyncProductsInMedusaCLI],
})
export class ScriptsModule {}
