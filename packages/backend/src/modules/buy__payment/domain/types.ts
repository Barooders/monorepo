import { AmountProps } from '@libs/domain/value-objects';

export interface CustomerInfoType {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  birthZipCode: string;
  civility: 'Mr' | 'Ms';
  phoneNumber: string;
  address: {
    line1: string;
    zipCode: string;
    city: string;
    countryCode: string;
  };
}

export interface CustomerHistory {
  firstOrderDate: string | null;
  lastOrderDate: string | null;
}

export interface CartInfoType {
  storeId: string;
  totalAmount: AmountProps;
  productsCount: number;
  products: {
    amount: AmountProps;
    shipping: string;
    productType: string;
    id: string;
  }[];
}

export interface EligibilityResponse {
  token?: string;
  paymentUrl?: string;
  paymentSolutionCode: string;
  isEligible: boolean;
  paymentId: string;
}

export interface CheckoutDetailsType {
  discountAmount: AmountProps;
  shippingAmount: AmountProps;
  productsAmount: AmountProps;
}
