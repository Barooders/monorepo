import { Injectable, Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { IEmailClient } from './ports/email.client';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private emailClient: IEmailClient) {}

  async notify(email: string | null, firstName: string | null) {
    if (!email) {
      this.logger.debug(`Cannot notify customer without email`);
      return;
    }
    if (!firstName) {
      this.logger.debug(`Notifying customer (${email}) without firstName`);
    }

    try {
      await this.emailClient.sendCreatedOfferEmail(email, firstName ?? '');
    } catch (error: any) {
      this.logger.error(
        `Cannot notify customer (${email}) because ${error.message}`,
        error,
      );
      Sentry.captureException(error);
    }
  }
}
