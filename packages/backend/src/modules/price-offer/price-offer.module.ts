import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { ChatModule } from '@modules/chat/chat.module';
import { ProductModule } from '@modules/product/product.module';
import { PriceOfferController } from './application/price-offer.web';
import { IEmailClient } from './domain/ports/email.client';
import { IInternalNotificationClient } from './domain/ports/internal-notification.client';
import { IPriceOfferService } from './domain/ports/price-offer';
import { IStoreClient } from './domain/ports/store.client';
import { PriceOfferService } from './domain/price-offer.service';
import { SendGridClient } from './infrastructure/email/sendgrid';
import { SlackClient } from './infrastructure/internal-notification/slack.client';
import { ShopifyClient } from './infrastructure/store/shopify';

@Module({
  imports: [PrismaModule, ChatModule, ProductModule],
  controllers: [PriceOfferController],
  providers: [
    PriceOfferService,
    {
      provide: IInternalNotificationClient,
      useClass: SlackClient,
    },
    {
      provide: IStoreClient,
      useClass: ShopifyClient,
    },
    {
      provide: IPriceOfferService,
      useClass: PriceOfferService,
    },
    {
      provide: IEmailClient,
      useClass: SendGridClient,
    },
  ],
  exports: [IPriceOfferService],
})
export class PriceOfferModule {}
