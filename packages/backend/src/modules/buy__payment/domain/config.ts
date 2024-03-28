import { PaymentSolutionCode } from '@libs/domain/prisma.main.client';

export { PaymentSolutionCode as PaymentSolution } from '@libs/domain/prisma.main.client';

export enum PaymentProvider {
  FLOA = 'FLOA',
  YOUNITED = 'YOUNITED',
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  ALMA = 'ALMA',
}

export type PaymentSolutionConfigType = {
  provider: PaymentProvider;
  externalCode: null | string;
  code: PaymentSolutionCode;
  checkoutLabel: null | string;
  needManualRefund: boolean;
};

export const paymentSolutionConfig: {
  [key: string]: PaymentSolutionConfigType;
} = {
  [PaymentSolutionCode.CREDIT_CARD]: {
    provider: PaymentProvider.STRIPE,
    externalCode: null,
    code: PaymentSolutionCode.CREDIT_CARD,
    checkoutLabel: null,
    needManualRefund: false,
  },
  [PaymentSolutionCode.BANK_WIRE]: {
    provider: PaymentProvider.STRIPE,
    externalCode: null,
    code: PaymentSolutionCode.BANK_WIRE,
    checkoutLabel: 'Virement bancaire',
    needManualRefund: true,
  },
  [PaymentSolutionCode.PAYPAL]: {
    provider: PaymentProvider.PAYPAL,
    externalCode: null,
    code: PaymentSolutionCode.PAYPAL,
    checkoutLabel: 'Paypal',
    needManualRefund: false,
  },
  [PaymentSolutionCode.ALMA_2X]: {
    provider: PaymentProvider.ALMA,
    externalCode: null,
    code: PaymentSolutionCode.ALMA_2X,
    checkoutLabel: 'Alma - Pay in 2 installments',
    needManualRefund: false,
  },
  [PaymentSolutionCode.ALMA_3X]: {
    provider: PaymentProvider.ALMA,
    externalCode: null,
    code: PaymentSolutionCode.ALMA_3X,
    checkoutLabel: 'Alma - Pay in 3 installments',
    needManualRefund: false,
  },
  [PaymentSolutionCode.ALMA_4X]: {
    provider: PaymentProvider.ALMA,
    externalCode: null,
    code: PaymentSolutionCode.ALMA_4X,
    checkoutLabel: 'Alma - Pay in 4 installments',
    needManualRefund: false,
  },
  [PaymentSolutionCode.FLOA_10X]: {
    provider: PaymentProvider.FLOA,
    externalCode: '98',
    code: PaymentSolutionCode.FLOA_10X,
    checkoutLabel: 'Paiement 10x - Floa Pay',
    needManualRefund: true,
  },
  [PaymentSolutionCode.FLOA_4X]: {
    provider: PaymentProvider.FLOA,
    externalCode: '63',
    code: PaymentSolutionCode.FLOA_4X,
    checkoutLabel: 'Paiement 4x - Floa Pay',
    needManualRefund: true,
  },
  [PaymentSolutionCode.FLOA_3X]: {
    provider: PaymentProvider.FLOA,
    externalCode: '81',
    code: PaymentSolutionCode.FLOA_3X,
    checkoutLabel: 'Paiement 3x - Floa Pay',
    needManualRefund: true,
  },
  [PaymentSolutionCode.YOUNITED_36x]: {
    provider: PaymentProvider.YOUNITED,
    externalCode: null,
    code: PaymentSolutionCode.YOUNITED_36x,
    checkoutLabel: 'Paiement 36x - Younited Pay',
    needManualRefund: true,
  },
  [PaymentSolutionCode.YOUNITED_24x]: {
    provider: PaymentProvider.YOUNITED,
    externalCode: null,
    code: PaymentSolutionCode.YOUNITED_24x,
    checkoutLabel: 'Paiement 24x - Younited Pay',
    needManualRefund: true,
  },
  [PaymentSolutionCode.YOUNITED_10x]: {
    provider: PaymentProvider.YOUNITED,
    externalCode: null,
    code: PaymentSolutionCode.YOUNITED_10x,
    checkoutLabel: 'Paiement 10x - Younited Pay',
    needManualRefund: true,
  },
};

export const getPaymentConfig = (
  provider: PaymentProvider,
  externalCode: string,
) =>
  Object.values(paymentSolutionConfig).find(
    (config) =>
      config.externalCode === externalCode && config.provider === provider,
  );
