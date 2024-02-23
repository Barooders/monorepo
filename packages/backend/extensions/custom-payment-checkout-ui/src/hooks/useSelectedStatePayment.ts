import { useSelectedPaymentOptions } from '@shopify/ui-extensions-react/checkout';
import { ManualStateType } from '../constants';
import useManualStatePayment from './useManualStatePayment';
import { first } from 'lodash';

const useSelectedStatePayment = (): [
  ManualStateType | null,
  (newState: Partial<ManualStateType>) => void,
] => {
  const selectedOptions = useSelectedPaymentOptions();
  const [manualPaymentState, updateManualPaymentState] =
    useManualStatePayment();

  const updateSelectedPaymentState = (
    newSelectedPaymentState: Partial<ManualStateType>,
  ) => {
    const newPaymentState = {
      ...manualPaymentState,
      [selectedOption.handle]: {
        ...selectedPaymentState,
        ...newSelectedPaymentState,
      },
    };
    updateManualPaymentState(newPaymentState);
  };

  const selectedOption = first(selectedOptions);

  const hasSelectedManualPayment = selectedOption.type === 'manualPayment';

  if (!hasSelectedManualPayment) return [null, updateSelectedPaymentState];

  const selectedPaymentState = manualPaymentState[selectedOption.handle];

  return [selectedPaymentState, updateSelectedPaymentState];
};

export default useSelectedStatePayment;
