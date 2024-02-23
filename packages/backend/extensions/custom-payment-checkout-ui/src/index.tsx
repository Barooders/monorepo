import {
  Banner,
  BlockStack,
  Button,
  Image,
  Spinner,
  View,
  reactExtension,
  useBuyerJourneyIntercept,
  useTranslate,
} from '@shopify/ui-extensions-react/checkout';
import { PaymentStatus } from './constants';

import useRedirectToPaymentLink from './hooks/useRedirectToPaymentLink';
import useSelectedStatePayment from './hooks/useSelectedStatePayment';
import useCheckPaymentStatus from './hooks/useCheckPaymentStatus';
import EligibilityForm from './components/EligibilityForm';
import RedirectToPayment from './components/RedirectToPayment';

export default reactExtension('purchase.checkout.block.render', () => (
  <Extension />
));

function Extension() {
  const [selectedPaymentState] = useSelectedStatePayment();
  const translate = useTranslate();
  const redirectPaymentUrl = useRedirectToPaymentLink();

  useCheckPaymentStatus(5000);

  useBuyerJourneyIntercept(({ canBlockProgress }) =>
    canBlockProgress &&
    selectedPaymentState !== null &&
    !isSelectedPaymentValidated()
      ? {
          behavior: 'block',
          reason: 'Waiting for payment processing',
          errors: [
            {
              message: translate('blockedProgressError'),
            },
          ],
        }
      : {
          behavior: 'allow',
        },
  );

  if (!selectedPaymentState) return <></>;

  const isSelectedPaymentValidated = () =>
    selectedPaymentState.status === PaymentStatus.VALIDATED;

  const renderStep = () => {
    switch (selectedPaymentState.status) {
      case PaymentStatus.NEED_ELIGIBILITY:
      case PaymentStatus.CREATED:
        return <EligibilityForm paymentHandle={selectedPaymentState.handle} />;

      case PaymentStatus.NOT_ELIGIBLE:
        return <Banner status="warning">{translate('notEligible')}</Banner>;

      case PaymentStatus.ELIGIBLE:
        return (
          <BlockStack spacing="base">
            <RedirectToPayment />
          </BlockStack>
        );

      case PaymentStatus.STARTED:
        return (
          <BlockStack
            spacing="base"
            inlineAlignment="center"
          >
            <View>{translate('ongoingPayment')}</View>
            <Spinner />
            <Button to={redirectPaymentUrl}>{translate('goToPayment')}</Button>
          </BlockStack>
        );

      case PaymentStatus.REFUSED:
        return <Banner status="warning">{translate('paymentRefused')}</Banner>;

      case PaymentStatus.VALIDATED:
        return (
          <Banner status="success">{translate('paymentValidated')}</Banner>
        );

      default:
        return <Banner status="critical">{translate('error')}</Banner>;
    }
  };

  return (
    <View
      border="base"
      padding="base"
      id="custom-payment-container"
    >
      <View
        inlineAlignment="center"
        padding={['base', 'none', 'loose', 'none']}
      >
        <View maxInlineSize={200}>
          <Image
            source="https://cdn.shopify.com/s/files/1/0576/4340/1365/files/floa-logo.png?v=1698132511"
            accessibilityDescription="Floa"
          />
        </View>
      </View>
      {renderStep()}
    </View>
  );
}
