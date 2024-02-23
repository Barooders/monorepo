import {
  useApplyAttributeChange,
  useAttributes,
  useAvailablePaymentOptions,
  useSettings,
} from '@shopify/ui-extensions-react/checkout';
import {
  PaymentStatus,
  ManualStateType,
  VALIDATED_PAYMENT_ATTRIBUTE_KEY,
  PaymentSolutions,
  paymentConfig,
} from '../constants';
import { useEffect } from 'react';
import first from 'lodash/first';
import useCheckoutId from './useCheckoutId';
import useHasura from './useHasura';

const SEARCH_PAYMENT_STATUS = `
	query searchPaymentState($paymentCode: PaymentSolutionCode, $checkoutId: String!) {
		Payment(where: {
			_and: {
				checkoutId: {_eq: $checkoutId},
				paymentSolutionCode: {_eq: $paymentCode},
				status: {_neq: "ABANDONED"}
			}
		}) {
			status
			id
		}
	}
`;

const useManualStatePayment = (): [
  Record<string, ManualStateType>,
  (newState: Record<string, ManualStateType>) => void,
  () => Promise<void>,
] => {
  const attributes = useAttributes();
  const applyAttributeChange = useApplyAttributeChange();
  const availableOptions = useAvailablePaymentOptions();
  const settings = useSettings();
  const fetchCheckoutId = useCheckoutId();
  const fetchHasura = useHasura();

  const manualPaymentState = JSON.parse(
    attributes.find(
      (attribute) => attribute.key === VALIDATED_PAYMENT_ATTRIBUTE_KEY,
    )?.value ?? '{}',
  ) as Record<string, ManualStateType>;

  const updateManualPaymentState = (
    newManualPaymentState: Record<string, ManualStateType>,
  ) => {
    console.log('New state payment: ', newManualPaymentState);
    applyAttributeChange({
      type: 'updateAttribute',
      key: VALIDATED_PAYMENT_ATTRIBUTE_KEY,
      value: JSON.stringify({
        ...manualPaymentState,
        ...newManualPaymentState,
      }),
    });
  };

  const searchPaymentState = async (
    paymentCode: PaymentSolutions,
    checkoutId: string | null,
  ) => {
    const response = await fetchHasura<{
      Payment: {
        status: string;
        id: string;
      }[];
    }>(SEARCH_PAYMENT_STATUS, {
      variables: { paymentCode, checkoutId },
    });

    return first(response?.Payment);
  };

  const refreshPaymentStatus = async () => {
    const checkoutId = await fetchCheckoutId();
    const newManualPaymentState = {};
    for (const { settingsName, paymentSolutionCode } of paymentConfig) {
      const paymentHandle = settings[settingsName]?.toString();
      if (!paymentHandle) continue;

      const existingPaymentState = await searchPaymentState(
        paymentSolutionCode,
        checkoutId,
      );
      newManualPaymentState[paymentHandle] = {
        handle: paymentHandle,
        status: existingPaymentState?.status ?? PaymentStatus.NEED_ELIGIBILITY,
        id: existingPaymentState?.id,
      };
    }
    updateManualPaymentState(newManualPaymentState);
  };

  useEffect(() => {
    console.log(
      `Available payment options: ${JSON.stringify(availableOptions, null, 2)}`,
    );
  }, []);

  useEffect(() => {
    refreshPaymentStatus();
  }, []);

  return [manualPaymentState, updateManualPaymentState, refreshPaymentStatus];
};

export default useManualStatePayment;
