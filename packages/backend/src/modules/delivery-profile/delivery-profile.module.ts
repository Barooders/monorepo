import { Module } from '@nestjs/common';

import { PostgreSQLSessionStorage } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/postgresql-session-storage.lib';
import { SessionMapper } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/session.mapper';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';

import { PrismaModule } from '@libs/domain/prisma.module';
import { DeliveryProfileController } from './application/delivery-profile.web';
import { DeliveryProfileService } from './domain/delivery-profile.service';

@Module({
  imports: [PrismaModule],
  controllers: [DeliveryProfileController],
  providers: [
    ShopifyApiBySession,
    SessionMapper,
    PostgreSQLSessionStorage,
    DeliveryProfileService,
  ],
})
export class DeliveryProfileModule {}
