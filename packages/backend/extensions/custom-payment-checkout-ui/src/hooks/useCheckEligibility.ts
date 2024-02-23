import {
  useShippingAddress,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';
import useBackend from './useBackend';
import {
  ManualStateType,
  PaymentSolutions,
  PaymentStatus,
  paymentConfig,
} from '../constants';
import useManualStatePayment from './useManualStatePayment';
import useCheckoutId from './useCheckoutId';
import useCartInfo, { CartInfoType } from './useCartInfo';

export type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  birthZipCode: string;
  civility: string;
  phoneNumber: string;
};

type ProductEligibilityDTO = {
  customerInfo: CustomerInfo & {
    address: {
      line1: string;
      zipCode: string;
      city: string;
      countryCode: string;
    };
  };
  cartInfo: CartInfoType;
  checkoutId: string;
  paymentSolutionCode: PaymentSolutions;
};

export type EligibilityResult = {
  paymentSolutionCode: PaymentSolutions;
  isEligible: boolean;
  paymentId: string;
};

type EligibilityResponse = EligibilityResult[];

const useCheckEligibility = () => {
  const fetchBackend = useBackend();
  const shippingAddress = useShippingAddress();
  const cartInfo = useCartInfo();
  const [, updateManualPaymentState] = useManualStatePayment();
  const settings = useSettings();
  const fetchCheckoutId = useCheckoutId();

  const findPaymentHandleFromSolutionCode = (
    paymentSolutionCode: PaymentSolutions,
  ): string | undefined =>
    settings[
      paymentConfig.find(
        (config) => config.paymentSolutionCode === paymentSolutionCode,
      )?.settingsName
    ]?.toString();

  const findSolutionCodeFromPaymentHandle = (
    paymentHandle: string,
  ): PaymentSolutions => {
    const settingsName = Object.keys(settings).find(
      (settingName) => settings[settingName] === paymentHandle,
    );
    if (!settingsName)
      throw new Error(
        `Payment handle ${paymentHandle} in not mapped in extension settings`,
      );

    return paymentConfig.find((config) => config.settingsName === settingsName)
      .paymentSolutionCode;
  };

  const updatePaymentStateFromEligibility = (response: EligibilityResponse) => {
    const newManualState: Record<string, ManualStateType> = response.reduce(
      (newState, eligibility) => {
        const paymentHandle = findPaymentHandleFromSolutionCode(
          eligibility.paymentSolutionCode,
        );

        return !paymentHandle
          ? newState
          : {
              ...newState,
              [paymentHandle]: {
                handle: paymentHandle,
                status: eligibility.isEligible
                  ? PaymentStatus.ELIGIBLE
                  : PaymentStatus.NOT_ELIGIBLE,
                id: eligibility.paymentId,
              },
            };
      },
      {},
    );

    updateManualPaymentState(newManualState);
  };

  return async (customerInfo: CustomerInfo, paymentHandle: string) => {
    const checkoutId = await fetchCheckoutId();
    const payload: ProductEligibilityDTO = {
      customerInfo: {
        ...customerInfo,
        address: {
          city: shippingAddress.city,
          countryCode: shippingAddress.countryCode,
          line1: shippingAddress.address1,
          zipCode: shippingAddress.zip,
        },
      },
      cartInfo,
      checkoutId,
      paymentSolutionCode: findSolutionCodeFromPaymentHandle(paymentHandle),
    };

    const response = await fetchBackend<EligibilityResponse>(
      '/v1/buy/payment/eligibility',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      },
    );

    updatePaymentStateFromEligibility(response);

    return response;
  };
};

export default useCheckEligibility;
