import { useSettings } from '@shopify/ui-extensions-react/checkout';
import useSelectedStatePayment from './useSelectedStatePayment';
import { useInterval } from 'react-use';
import { PaymentStatus } from '../constants';

const FETCH_PAYMENT_STATUS = `
	query checkPaymentStatus($paymentId: String!) {
		Payment_by_pk(id: $paymentId) {
		  status
		}
	}
`;

const useCheckPaymentStatus = (delay: number) => {
  const [selectedPayment, updateSelectedPayment] = useSelectedStatePayment();
  const settings = useSettings();

  const getPaymentStatus = async (
    paymentId: string,
  ): Promise<PaymentStatus | undefined> => {
    const response = await fetch(
      `${settings.hasura_base_url.toString()}/v1/graphql`,
      {
        method: 'POST',
        body: JSON.stringify({
          query: FETCH_PAYMENT_STATUS,
          variables: { paymentId },
        }),
      },
    );

    const result = (await response.json()) as {
      data: {
        Payment_by_pk: {
          status: string;
        };
      };
    };

    return result?.data?.Payment_by_pk?.status as PaymentStatus | undefined;
  };

  useInterval(async () => {
    if (selectedPayment?.status !== PaymentStatus.STARTED) return;
    const status = await getPaymentStatus(selectedPayment?.id);
    if ([PaymentStatus.VALIDATED, PaymentStatus.REFUSED].includes(status)) {
      updateSelectedPayment({
        status,
      });
    }
  }, delay);
};

export default useCheckPaymentStatus;
