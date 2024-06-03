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
import { BuyerCommissionController } from './application/buyer-commission.web';
import { CommissionCLIConsole } from './application/commission.cli';
import { ProductCLIConsole } from './application/product.cli';
import { ProductController } from './application/product.web';
import { QueueNames } from './config';
import { BuyerCommissionService } from './domain/buyer-commission.service';
import { CollectionIndexationService } from './domain/collection-indexation.service';
import { CollectionService } from './domain/collection.service';
import { NotificationService } from './domain/notification.service';
import { ICommissionRepository } from './domain/ports/commission.repository';
import { IEmailClient } from './domain/ports/email.client';
import { IInternalNotificationClient } from './domain/ports/internal-notification.client';
import { IPIMClient } from './domain/ports/pim.client';
import { IQueueClient } from './domain/ports/queue-client';
import { ISearchClient } from './domain/ports/search-client';
import { IStoreClient } from './domain/ports/store.client';
import { ProductCreationService } from './domain/product-creation.service';
import { ProductUpdateService } from './domain/product-update.service';
import { VariantIndexationService } from './domain/variant-indexation.service';
import { CommissionRepository } from './infrastructure/config/commission.repository';
import { EventRepository } from './infrastructure/database/event.repository';
import { SendGridClient } from './infrastructure/email/sendgrid.client';
import { SlackClient } from './infrastructure/internal-notification/slack.client';
import { StrapiClient } from './infrastructure/pim/strapi.client';
import { QueueClient } from './infrastructure/queue/queue.client';
import { SearchClient } from './infrastructure/search/search.client';
import { ImageUploadsClient } from './infrastructure/store/image-uploads-client';
import { StoreClient } from './infrastructure/store/index.client';
import { MedusaClient } from './infrastructure/store/medusa.client';
import { ShopifyClient } from './infrastructure/store/shopify.client';
import { StoreMapper } from './infrastructure/store/store.mapper';

const commonImports = [
  PrismaModule,
  BullModule.registerQueueAsync({
    name: QueueNames.PRODUCTS_TO_INDEX,
    useFactory: getRedisConfig,
  }),
];

const commonProviders = [
  ShopifyApiBySession,
  BuyerCommissionService,
  SessionMapper,
  PostgreSQLSessionStorage,
  CustomerRepository,
  VariantIndexationService,
  CollectionIndexationService,
  StoreMapper,
  {
    provide: ISearchClient,
    useClass: SearchClient,
  },
  {
    provide: ICommissionRepository,
    useClass: CommissionRepository,
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
    useClass: StoreClient,
  },
  {
    provide: IEmailClient,
    useClass: SendGridClient,
  },
  {
    provide: IInternalNotificationClient,
    useClass: SlackClient,
  },
  MedusaClient,
  ShopifyClient,
  ImageUploadsClient,
  NotificationService,
  ProductCreationService,
  ProductUpdateService,
  EventRepository,
  CollectionService,
  AdminGuard,
  AuthGuard('header-api-key'),
];

@Module({
  imports: commonImports,
  controllers: [ProductController, BuyerCommissionController],
  providers: commonProviders,
  exports: [
    ProductCreationService,
    ProductUpdateService,
    BuyerCommissionService,
    IPIMClient,
    ICommissionRepository,
    MedusaClient,
  ],
})
export class ProductModule {}

@Module({
  imports: commonImports,
  controllers: [],
  providers: [...commonProviders, ProductCLIConsole, CommissionCLIConsole],
})
export class ProductConsoleModule {}
