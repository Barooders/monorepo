import { PaymentSolution } from '../config';
import {
  CheckoutDetailsType,
  CartInfoType,
  CustomerHistory,
  CustomerInfoType,
  EligibilityResponse,
} from '../types';

export abstract class IPaymentProvider {
  abstract checkEligibility: (
    customerInfo: CustomerInfoType,
    customerHistory: CustomerHistory,
    cartInfo: CartInfoType,
    payment: { id: string; paymentSolutionCode: PaymentSolution },
    returnUrl: string,
    notifyUrl: string,
  ) => Promise<EligibilityResponse[]>;

  abstract createPaymentLink: (
    token: string,
    returnUrl: string,
    notifyUrl: string,
    paymentSolutionCode: PaymentSolution,
    checkoutId: string,
    checkoutDetails: CheckoutDetailsType | null,
  ) => Promise<string>;
}
