import envConfig from '@config/env/env.config';
import { sendSlackMessage } from '@libs/infrastructure/slack/slack.base.client';
import { IInternalNotificationClient } from '@modules/order/domain/ports/internal-notification.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SlackClient implements IInternalNotificationClient {
  async sendOrderPaidNotification(message: string): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.orderPaidSlackChannelId,
      message,
    );
  }

  async sendFirstSaleNotification(message: string): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.salesTeamSlackChannelId,
      message,
    );
  }

  async sendOrderCreatedWithBaroodersSplitPaymentNotification(
    message: string,
  ): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.orderCreatedSlackChannelId,
      message,
    );
  }

  async sendErrorNotification(message: string): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.errorSlackChannelId,
      message,
    );
  }

  async sendOrderCanceledNotification(message: string): Promise<void> {
    await sendSlackMessage(
      envConfig.externalServices.slack.orderCanceledSlackChannelId,
      message,
    );
  }
}
