import { useSettings } from '@shopify/ui-extensions-react/checkout';
import useSelectedStatePayment from './useSelectedStatePayment';

const useRedirectToPaymentLink = () => {
  const settings = useSettings();
  const [selectedPaymentState] = useSelectedStatePayment();
  if (!selectedPaymentState) return '';

  const searchParams = new URLSearchParams({
    paymentId: selectedPaymentState.id,
  });

  const redirectUrl = `${settings.backend_url.toString()}/v1/buy/payment/link/redirect?${searchParams.toString()}`;
  return redirectUrl;
};

export default useRedirectToPaymentLink;
