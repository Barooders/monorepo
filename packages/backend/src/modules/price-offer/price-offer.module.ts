import { Module } from '@nestjs/common';

import envConfig from '@config/env/env.config';
import { AdminGuard } from '@libs/application/decorators/admin.guard';
import { PrismaModule } from '@libs/domain/prisma.module';
import { ChatModule } from '@modules/chat/chat.module';
import { ProductModule } from '@modules/product/product.module';
import { AuthGuard } from '@nestjs/passport';
import { PriceOfferController } from './application/price-offer.web';
import { IEmailClient } from './domain/ports/email.client';
import { IInternalNotificationClient } from './domain/ports/internal-notification.client';
import { IInternalTrackingClient } from './domain/ports/internal-tracking.client';
import { IPriceOfferService } from './domain/ports/price-offer';
import { IStoreClient } from './domain/ports/store.client';
import { PriceOfferService } from './domain/price-offer.service';
import { EventRepository } from './infrastructure/database/event.repository';
import { SendGridClient } from './infrastructure/email/sendgrid';
import { AirtableClient } from './infrastructure/internal-notification/airtable.client';
import { SlackClient } from './infrastructure/internal-notification/slack.client';
import { MedusaClient } from './infrastructure/store/medusa.client';
import { ShopifyClient } from './infrastructure/store/shopify';

@Module({
  imports: [PrismaModule, ChatModule, ProductModule],
  controllers: [PriceOfferController],
  providers: [
    PriceOfferService,
    EventRepository,
    {
      provide: IInternalNotificationClient,
      useClass: SlackClient,
    },
    {
      provide: IInternalTrackingClient,
      useClass: AirtableClient,
    },
    {
      provide: IStoreClient,
      useClass: envConfig.featureFlags.useMedusaClient
        ? MedusaClient
        : ShopifyClient,
    },
    {
      provide: IPriceOfferService,
      useClass: PriceOfferService,
    },
    {
      provide: IEmailClient,
      useClass: SendGridClient,
    },
    AdminGuard,
    AuthGuard('header-api-key'),
  ],
  exports: [IPriceOfferService],
})
export class PriceOfferModule {}
