import { AdminGuard } from '@libs/application/decorators/admin.guard';
import { CustomerRepository } from '@libs/domain/customer.repository';
import { PrismaModule } from '@libs/domain/prisma.module';
import { getRedisConfig } from '@libs/infrastructure/redis/redis.config';
import { PostgreSQLSessionStorage } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/postgresql-session-storage.lib';
import { SessionMapper } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/session.mapper';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProductCLIConsole } from './application/product.cli';
import { ProductController } from './application/product.web';
import { QueueNames } from './config';
import { CollectionService } from './domain/collection.service';
import { PublicIndexationService } from './domain/public-indexation.service';
import { IndexationService } from './domain/indexation.service';
import { NotificationService } from './domain/notification.service';
import { IEmailClient } from './domain/ports/email.client';
import { IPIMClient } from './domain/ports/pim.client';
import { IQueueClient } from './domain/ports/queue-client';
import { ISearchClient } from './domain/ports/search-client';
import { IStoreClient } from './domain/ports/store.client';
import { ProductCreationService } from './domain/product-creation.service';
import { ProductUpdateService } from './domain/product-update.service';
import { SendGridClient } from './infrastructure/email/sendgrid.client';
import { StrapiClient } from './infrastructure/pim/strapi.client';
import { QueueClient } from './infrastructure/queue/queue.client';
import { SearchClient } from './infrastructure/search/search.client';
import { ShopifyClient } from './infrastructure/store/shopify.client';
import { StoreMapper } from './infrastructure/store/store.mapper';
import { B2BIndexationService } from './domain/b2b-indexation.service';

const commonImports = [
  PrismaModule,
  BullModule.registerQueueAsync({
    name: QueueNames.PRODUCTS_TO_INDEX,
    useFactory: getRedisConfig,
  }),
];

const commonProviders = [
  ShopifyApiBySession,
  SessionMapper,
  PostgreSQLSessionStorage,
  CustomerRepository,
  PublicIndexationService,
  B2BIndexationService,
  IndexationService,
  StoreMapper,
  {
    provide: ISearchClient,
    useClass: SearchClient,
  },
  {
    provide: IQueueClient,
    useClass: QueueClient,
  },
  {
    provide: IPIMClient,
    useClass: StrapiClient,
  },
  {
    provide: IStoreClient,
    useClass: ShopifyClient,
  },
  {
    provide: IEmailClient,
    useClass: SendGridClient,
  },
  NotificationService,
  ProductCreationService,
  ProductUpdateService,
  CollectionService,
  AdminGuard,
  AuthGuard('header-api-key'),
];

@Module({
  imports: commonImports,
  controllers: [ProductController],
  providers: commonProviders,
  exports: [ProductCreationService, ProductUpdateService, IPIMClient],
})
export class ProductModule {}

@Module({
  imports: commonImports,
  controllers: [],
  providers: [...commonProviders, ProductCLIConsole],
})
export class ProductConsoleModule {}
