import { Amount } from '@libs/domain/value-objects';
import { sendEmailFromTemplate } from '@libs/infrastructure/send-grid/send-grid.base.client';
import {
  ParticipantEmailSender,
  Participants,
} from '@modules/price-offer/domain/config';
import { IEmailClient } from '@modules/price-offer/domain/ports/email.client';

const TEMPLATE_IDS = {
  ACCEPTED_PRICE_OFFER: {
    [Participants.SELLER]: 'd-144e48b56dd94b3eb43cfe4b77881628',
    [Participants.BUYER]: 'd-d8f470eaed8640ee9d50c82da8255284',
  },
  DECLINED_PRICE_OFFER: {
    [Participants.INITIATOR]: 'd-203b88c106404b049557b10fa22fc460',
  },
  NEW_PRICE_OFFER: {
    [Participants.RECEIVER]: 'd-e2e562ea5d55474aa26055ec97b616dd',
  },
};

export class SendGridClient implements IEmailClient {
  buildDeclinedEmailSender(): ParticipantEmailSender {
    return async (participants, conversationId) => {
      await sendEmailFromTemplate(
        [{ email: participants[Participants.INITIATOR].email }],
        TEMPLATE_IDS.DECLINED_PRICE_OFFER.INITIATOR,
        {
          receiver_offer_name: participants[Participants.RECEIVER].name,
          conversation_id: conversationId,
        },
      );
    };
  }

  buildNewEmailSender(
    productTitle: string,
    newPrice: Amount,
  ): ParticipantEmailSender {
    return async (participants, conversationId) => {
      await sendEmailFromTemplate(
        [{ email: participants[Participants.RECEIVER].email }],
        TEMPLATE_IDS.NEW_PRICE_OFFER[Participants.RECEIVER],
        {
          new_price: newPrice.formattedAmount,
          product_title: productTitle,
          sender_offer_name: participants[Participants.INITIATOR].name,
          conversation_id: conversationId,
        },
      );
    };
  }

  buildAcceptedEmailSender(
    newPrice: Amount,
    productTitle: string,
    discountCode: string,
  ): ParticipantEmailSender {
    return async (participants, conversationId) => {
      const buyer = participants[Participants.BUYER];
      const seller = participants[Participants.SELLER];

      await sendEmailFromTemplate(
        [{ email: buyer.email }],
        TEMPLATE_IDS.ACCEPTED_PRICE_OFFER[Participants.BUYER],
        {
          buyer_pseudo: buyer.name,
          new_price: newPrice.formattedAmount,
          product_title: productTitle,
          seller_pseudo: seller.name,
          code_promo: discountCode,
          conversation_id: conversationId,
        },
      );
      await sendEmailFromTemplate(
        [{ email: seller.email }],
        TEMPLATE_IDS.ACCEPTED_PRICE_OFFER[Participants.SELLER],
        {
          buyer_pseudo: buyer.name,
          new_price: newPrice.formattedAmount,
          seller_pseudo: seller.email,
          code_promo: discountCode,
          conversation_id: conversationId,
        },
      );
    };
  }
}
