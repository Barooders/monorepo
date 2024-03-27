import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { ChatModule } from '@modules/chat/chat.module';
import { PriceOfferController } from './application/price-offer.web';
import { ICommissionRepository } from './domain/ports/commission.repository';
import { IEmailClient } from './domain/ports/email.client';
import { IInternalNotificationClient } from './domain/ports/internal-notification.client';
import { IPriceOfferService } from './domain/ports/price-offer';
import { IStoreClient } from './domain/ports/store.client';
import { PriceOfferService } from './domain/price-offer.service';
import { CommissionRepository } from './infrastructure/config/commission.repository';
import { SendGridClient } from './infrastructure/email/sendgrid';
import { SlackClient } from './infrastructure/internal-notification/slack.client';
import { ShopifyClient } from './infrastructure/store/shopify';

@Module({
  imports: [PrismaModule, ChatModule],
  controllers: [PriceOfferController],
  providers: [
    PriceOfferService,
    {
      provide: ICommissionRepository,
      useClass: CommissionRepository,
    },
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
