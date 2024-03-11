import { Amount } from '@libs/domain/value-objects';
import { ParticipantEmailSender } from '../config';

export abstract class IEmailClient {
  abstract buildAcceptedEmailSender(
    newPrice: Amount,
    productTitle: string,
    discountCode: string,
  ): ParticipantEmailSender;
  abstract buildNewEmailSender(
    productTitle: string,
    newPrice: Amount,
  ): ParticipantEmailSender;
  abstract buildDeclinedEmailSender(): ParticipantEmailSender;
}
