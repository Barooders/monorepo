import { Module } from '@nestjs/common';

import { PrismaModule } from '@libs/domain/prisma.module';
import { PriceOfferController } from './application/price-offer.web';
import { PriceOfferService } from './domain/price-offer.service';
import { ChatModule } from '@modules/chat/chat.module';
import { IStoreClient } from './domain/ports/store.client';
import { ShopifyClient } from './infrastructure/store/shopify';
import { SendGridClient } from './infrastructure/email/sendgrid';
import { IPriceOfferService } from './domain/ports/price-offer';
import { IEmailClient } from './domain/ports/email.client';

@Module({
  imports: [PrismaModule, ChatModule],
  controllers: [PriceOfferController],
  providers: [
    PriceOfferService,
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
