import { Logger } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { Command, Console } from 'nestjs-console';
import { ExternalOrderService } from '../domain/external-order.service';
import { FulfillmentService } from '../domain/fulfillment.service';
import { OrderNotificationService } from '../domain/order-notification.service';
import { RefundService } from '../domain/refund.service';

@Console({
  command: 'order',
  description: 'Order CLI',
})
export class OrderCLIConsole {
  private readonly logger: Logger = new Logger(OrderCLIConsole.name);

  constructor(
    private externalOrderService: ExternalOrderService,
    private fulfillmentService: FulfillmentService,
    private orderNotificationService: OrderNotificationService,
    private refundService: RefundService,
  ) {}

  @Command({
    command: 'createExternalOrders <orderId>',
    description: 'Create external orders from orderId.',
  })
  async createExternalOrders(orderId: string): Promise<void> {
    await this.externalOrderService.createExternalOrders({ id: orderId });
  }

  @Command({
    command: 'checkFulfillmentStatus',
    description: 'Fulfill external orders when shipped',
  })
  async checkFulfillmentStatus(): Promise<void> {
    try {
      await this.fulfillmentService.checkFulfillmentStatus();
    } catch (e: any) {
      this.logger.error(e.message, e);
      Sentry.captureException(e);
    }
  }

  @Command({
    command: 'sendUnfulfilledOrdersEmails <numberOfDaysSinceOrderPaid>',
    description:
      'Send emails to vendor & customer when order line is unfulfilled.',
  })
  async sendUnfulfilledOrderLinesEmails(
    numberOfDaysSinceOrderPaid: string,
  ): Promise<void> {
    try {
      await this.orderNotificationService.sendUnfulfilledOrderLinesEmails(
        Number(numberOfDaysSinceOrderPaid),
      );
    } catch (e: any) {
      this.logger.error(e.message, e);
      Sentry.captureException(e);
    }
  }

  @Command({
    command: 'refundUnfulfilledOrders',
    description:
      'Refund unfulfilled orders that have been paid for more than 10 days ago.',
  })
  async refundUnfulfilledOrders(): Promise<void> {
    try {
      await this.refundService.refundUnfulfilledOrders();
    } catch (e: any) {
      this.logger.error(e.message, e);
      Sentry.captureException(e);
    }
  }
}
