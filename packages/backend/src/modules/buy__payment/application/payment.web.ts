import {
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  Res,
} from '@nestjs/common';

import { routesV1 } from '@config/routes.config';
import { Checkout } from '@libs/domain/prisma.main.client';
import { Response } from 'express';
import { PaymentService } from '../domain/payment.service';
import { EligibilityResponse } from '../domain/types';
import {
  CartInfoDTO,
  EligibilityInputDTO,
  PaymentLinkDTO,
} from './payment.dto';

@Controller(routesV1.version)
export class PaymentWebController {
  private readonly logger = new Logger(PaymentWebController.name);

  constructor(private paymentService: PaymentService) {}

  @Post(routesV1.buy.payment.getOrCreateCheckout)
  async getOrCreateCheckout(
    @Body()
    cartInfoDTO: CartInfoDTO,
  ): Promise<Checkout> {
    const checkout = await this.paymentService.getOrCreateCheckout(cartInfoDTO);

    return checkout;
  }

  @Post(routesV1.buy.payment.eligibility)
  async checkPaymentEligibility(
    @Body()
    productEligibilityDTO: EligibilityInputDTO,
  ): Promise<EligibilityResponse[]> {
    return this.paymentService.checkEligibility(
      productEligibilityDTO.customerInfo,
      productEligibilityDTO.cartInfo,
      productEligibilityDTO.checkoutId,
      productEligibilityDTO.paymentSolutionCode,
    );
  }

  @Post(routesV1.buy.payment.createPaymentLink)
  async createPaymentLink(
    @Body()
    paymentLinkDTO: PaymentLinkDTO,
  ): Promise<string> {
    return this.paymentService.startPayment(paymentLinkDTO.paymentId);
  }

  @Get(routesV1.buy.payment.redirectToPaymentPage)
  async redirectToPaymentLink(
    @Query()
    paymentLinkDTO: PaymentLinkDTO,
    @Res() res: Response,
  ): Promise<void> {
    const paymentLink = await this.paymentService.startPayment(
      paymentLinkDTO.paymentId,
    );

    return res.redirect(302, paymentLink);
  }
}
