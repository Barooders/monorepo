import {
  Banner,
  Button,
  Text,
  View,
  useTranslate,
} from '@shopify/ui-extensions-react/checkout';
import useRedirectToPaymentLink from '../hooks/useRedirectToPaymentLink';
import useSelectedStatePayment from '../hooks/useSelectedStatePayment';
import { PaymentStatus } from '../constants';

const RedirectToPayment = () => {
  const translate = useTranslate();
  const redirectPaymentUrl = useRedirectToPaymentLink();
  const [, updateSelectedPaymentState] = useSelectedStatePayment();

  const onStartPayment = () => {
    updateSelectedPaymentState({
      status: PaymentStatus.STARTED,
    });
  };

  return (
    <>
      <Banner status="success">
        <View padding={['none', 'none', 'base', 'none']}>
          <Text emphasis="bold">{translate('eligible')}</Text>
        </View>
        <View>{translate('eligibleNextStep')}</View>
      </Banner>
      <Button
        to={redirectPaymentUrl}
        onPress={onStartPayment}
      >
        {translate('goToPayment')}
      </Button>
    </>
  );
};

export default RedirectToPayment;
