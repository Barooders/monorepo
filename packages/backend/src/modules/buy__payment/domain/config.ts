import { PaymentSolutionCode } from '@libs/domain/prisma.main.client';

export { PaymentSolutionCode as PaymentSolution } from '@libs/domain/prisma.main.client';

export enum PaymentProvider {
  FLOA = 'FLOA',
}

export const paymentSolutionConfig = {
  [PaymentSolutionCode.FLOA_10X]: {
    provider: PaymentProvider.FLOA,
    externalCode: '98',
    code: PaymentSolutionCode.FLOA_10X,
  },
  [PaymentSolutionCode.FLOA_4X]: {
    provider: PaymentProvider.FLOA,
    externalCode: '63',
    code: PaymentSolutionCode.FLOA_4X,
  },
  [PaymentSolutionCode.FLOA_3X]: {
    provider: PaymentProvider.FLOA,
    externalCode: '81',
    code: PaymentSolutionCode.FLOA_3X,
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
