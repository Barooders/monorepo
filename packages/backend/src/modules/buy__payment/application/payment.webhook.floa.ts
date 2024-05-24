import {
  Body,
  Controller,
  Logger,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { NoFilesInterceptor } from '@nestjs/platform-express';
import { jsonStringify } from '@libs/helpers/json';

import envConfig from '@config/env/env.config';
import { routesV1 } from '@config/routes.config';
import { PaymentStatusType } from '@libs/domain/prisma.main.client';
import { createHmac } from 'crypto';
import { getPaymentConfig, PaymentProvider } from '../domain/config';
import { PaymentService } from '../domain/payment.service';
import floaCodeMapping from './config.floa';
import { floaResultPage } from './views';

export type NotififyInputDTO = {
  version: string;
  merchantID: string;
  merchantSiteID: string;
  paymentOptionRef: string;
  orderRef: string;
  orderTag: string;
  freeText: string;
  invoiceID: string;
  customerRef: string;
  date: string;
  amount: string;
  decimalPosition: string;
  currency: string;
  country: string;
  merchantAccountRef: string;
  scheduleDate1: string;
  scheduleAmount1: string;
  scheduleDate2: string;
  scheduleAmount2: string;
  scheduleDate3: string;
  scheduleAmount3: string;
  scheduleDate4: string;
  scheduleAmount4: string;
  cardType: string;
  scoringToken: string;
  hmac: string;
  reportDelayInDays: string;

  // 0 : Successful (Transaction ok)
  // 1 : Refused (Transaction is refused for various reasons)
  // 2 : Refused by bank (Transaction is refused by our PSP or customer's bank)
  // 3 : Failed (Technical failure)
  // 4 : Pending (Transaction waiting for a manual review)
  // 5 : Unknown (Transaction is on an indetermined state, consider that the transaction is refused)
  // 6 : Canceled (Transaction cancelled)
  returnCode: string;

  // See details in Floa status CSV
  complementaryReturnCode: string;
};

@Controller(routesV1.version)
export class PaymentFloaWebhookController {
  private readonly logger = new Logger(PaymentFloaWebhookController.name);

  constructor(private paymentService: PaymentService) {}

  @Post(routesV1.buy.payment.notifyPaymentResult)
  @UseInterceptors(NoFilesInterceptor())
  async notifyPaymentResult(@Body() body: NotififyInputDTO) {
    const webhookHMAC = this.calculateWebhookHMAC(body);
    if (webhookHMAC !== body.hmac) {
      this.logger.warn(
        `HMAC validation failed: ${body.hmac} vs ${webhookHMAC}`,
      );
    }

    const paymentConfig = getPaymentConfig(
      PaymentProvider.FLOA,
      body.paymentOptionRef,
    );

    if (!paymentConfig)
      throw new Error(`Unsupported payment type ${body.paymentOptionRef}`);

    const newStatus =
      body.returnCode === '0'
        ? PaymentStatusType.VALIDATED
        : Number(body.returnCode) > 0
          ? PaymentStatusType.REFUSED
          : null;

    const reason =
      floaCodeMapping.find(
        (floaCode) =>
          floaCode.merchantReturnCodeId === body.returnCode?.toString() &&
          floaCode.complementaryCode ===
            body.complementaryReturnCode?.toString(),
      )?.description ??
      `${body.returnCode?.toString()} - ${body.complementaryReturnCode?.toString()}`;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!newStatus)
      throw new Error(
        `Could not determine status from Floa return code ${body.returnCode}`,
      );

    const checkoutUrl = await this.paymentService.updatePaymentStatus(
      body.orderRef,
      newStatus,
      reason,
      jsonStringify(body),
    );

    return floaResultPage(checkoutUrl ?? '');
  }

  private calculateWebhookHMAC(notification: NotififyInputDTO): string {
    let period = 1;
    const periodData = [];

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    while (notification[`scheduleDate${period}`]) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      periodData.push(notification[`scheduleDate${period}`]);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      periodData.push(notification[`scheduleAmount${period}`]);
      period++;
    }

    const toBeFiltered = 'TO_BE_FILTERED';
    const contentToCertify =
      [
        notification.version,
        notification.merchantID,
        notification.merchantSiteID,
        notification.paymentOptionRef,
        notification.orderRef,
        notification.orderTag ?? toBeFiltered,
        notification.freeText ?? '',
        notification.decimalPosition,
        notification.currency,
        notification.country,
        notification.invoiceID ?? '',
        notification.customerRef,
        notification.date,
        notification.amount,
        notification.returnCode,
        notification.complementaryReturnCode,
        notification.merchantAccountRef ?? '',
        ...periodData,
        notification.reportDelayInDays ?? toBeFiltered,
      ]
        .filter((value) => value !== toBeFiltered)
        .join('*') + '*';

    const hmac = createHmac('sha1', envConfig.externalServices.floa.hmacSecret);
    hmac.update(contentToCertify);
    const result = hmac.digest('hex').replace('-', '').toUpperCase();

    return result;
  }
}
