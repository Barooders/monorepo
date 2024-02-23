export const VALIDATED_PAYMENT_ATTRIBUTE_KEY = 'validatedManualPayment';

export type ManualStateType = {
  handle: string;
  status: PaymentStatus;
  id: string;
};

export enum PaymentStatus {
  NEED_ELIGIBILITY = 'NEED_ELIGIBILITY',
  CREATED = 'CREATED',
  ELIGIBLE = 'ELIGIBLE',
  NOT_ELIGIBLE = 'NOT_ELIGIBLE',
  STARTED = 'STARTED',
  REFUSED = 'REFUSED',
  VALIDATED = 'VALIDATED',
}

export enum Civility {
  MISTER = 'Mr',
  MISS = 'Ms',
}

export enum PaymentSolutions {
  FLOA_10X = 'FLOA_10X',
  FLOA_4X = 'FLOA_4X',
  FLOA_3X = 'FLOA_3X',
}

export const paymentConfig = [
  {
    settingsName: 'floa_payment_3x_handle',
    paymentSolutionCode: PaymentSolutions.FLOA_3X,
  },
  {
    settingsName: 'floa_payment_4x_handle',
    paymentSolutionCode: PaymentSolutions.FLOA_4X,
  },
  {
    settingsName: 'floa_payment_10x_handle',
    paymentSolutionCode: PaymentSolutions.FLOA_10X,
  },
];
