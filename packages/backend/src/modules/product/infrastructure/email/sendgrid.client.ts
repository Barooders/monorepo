import { sendEmailFromTemplate } from '@libs/infrastructure/send-grid/send-grid.base.client';
import { IEmailClient } from '@modules/product/domain/ports/email.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendGridClient implements IEmailClient {
  async sendCreatedOfferEmail(
    toEmail: string,
    toFirstName: string,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [{ email: toEmail }],
      'd-9d060f86ef2a4f78972842a9d9ae4d8d',
      {
        firstName: toFirstName,
      },
    );
  }

  async sendProductAvailabilityEmail(
    toEmail: string,
    toFirstName: string,
    oldProductThresholdInDays: number,
  ): Promise<void> {
    await sendEmailFromTemplate(
      [{ email: toEmail }],
      'd-e2e562ea5d55474aa26055ec97b616dd',
      {
        firstName: toFirstName,
        product_age: oldProductThresholdInDays,
      },
    );
  }
}
