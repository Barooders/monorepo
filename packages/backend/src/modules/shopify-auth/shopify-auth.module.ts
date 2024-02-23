import { Module } from '@nestjs/common';

import { PostgreSQLSessionStorage } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/postgresql-session-storage.lib';
import { SessionMapper } from '@libs/infrastructure/shopify/session-storage/postgresql-session-storage/session.mapper';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';

import { PrismaModule } from '@libs/domain/prisma.module';
import { ShopifyAuthController } from './application/shopify-auth.web';
import { ShopifyAuthService } from './domain/shopify-auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [ShopifyAuthController],
  providers: [
    ShopifyApiBySession,
    ShopifyAuthService,
    SessionMapper,
    PostgreSQLSessionStorage,
  ],
})
export class ShopifyAuthModule {}
