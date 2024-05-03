import envConfig from '@config/env/env.config';
import { sendSlackMessage } from '@libs/infrastructure/slack/slack.base.client';
import { IInternalNotificationClient } from '@modules/customer/domain/ports/internal-notification.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackClient implements IInternalNotificationClient {
  async sendErrorNotification(message: string): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.errorSlackChannelId,
      message,
    );
  }

  async sendB2BNotification(message: string): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.b2bSlackChannelId,
      message,
    );
  }
}
