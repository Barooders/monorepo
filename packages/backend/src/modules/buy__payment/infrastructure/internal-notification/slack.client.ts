import envConfig from '@config/env/env.config';
import { sendSlackMessage } from '@libs/infrastructure/slack/slack.base.client';
import { IInternalNotificationProvider } from '@modules/buy__payment/domain/ports/internal-notification.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackClient implements IInternalNotificationProvider {
  async notifyStatusChangeOnFloaPayment(message: string): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.orderCreatedSlackChannelId,
      message,
    );
  }
}
