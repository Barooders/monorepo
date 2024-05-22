import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { SharedLoggerModule } from '@libs/infrastructure/logging/shared-logger.module';
import { KlaviyoClient } from '@modules/customer/infrastructure/marketing/klaviyo.client';
import { IPIMClient } from '@modules/product/domain/ports/pim.client';
import { StrapiClient } from '@modules/product/infrastructure/pim/strapi.client';
import { ProductModule } from '@modules/product/product.module';
import { SyncProductsInMedusaCLI } from '@modules/scripts/create-medusa-products.cli';
import { ExtractSlackStatsCLI } from '@modules/scripts/extract-slack-stats.cli';
import { FixProductImageCLI } from '@modules/scripts/fix-product-images.cli';
import { TestFeatureCLI } from '@modules/scripts/test-feature.cli';
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
  providers: [
    FixProductImageCLI,
    TestFeatureCLI,
    ExtractSlackStatsCLI,
    SyncProductsInMedusaCLI,
    KlaviyoClient,
    {
      provide: IPIMClient,
      useClass: StrapiClient,
    },
  ],
})
export class ScriptsModule {}
