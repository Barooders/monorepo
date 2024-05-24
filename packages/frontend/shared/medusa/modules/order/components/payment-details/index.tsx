import { formatAmount } from '@/medusa/lib/util/prices';
import { Order } from '@medusajs/medusa';
import { Container, Heading, Text } from '@medusajs/ui';

import { getDictionary } from '@/i18n/translate';
import { paymentInfoMap } from '@/medusa/lib/constants';
import Divider from '@/medusa/modules/common/components/divider';

const dict = getDictionary('fr');

type PaymentDetailsProps = {
  order: Order;
};

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payments[0];
  return (
    <div>
      <Heading
        level="h2"
        className="text-3xl-regular my-6 flex flex-row"
      >
        {dict.checkout.payment.title}
      </Heading>
      <div>
        {payment && (
          <div className="flex w-full items-start gap-x-1">
            <div className="flex w-1/3 flex-col">
              <Text className="txt-medium-plus mb-1 text-ui-fg-base">
                {dict.checkout.payment.paymentMethod}
              </Text>
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method"
              >
                {paymentInfoMap[payment.provider_id].title}
              </Text>
            </div>
            <div className="flex w-2/3 flex-col">
              <Text className="txt-medium-plus mb-1 text-ui-fg-base">
                {dict.checkout.payment.paymentDetails}
              </Text>
              <div className="txt-medium flex items-center gap-2 text-ui-fg-subtle">
                <Container className="flex h-7 w-fit items-center bg-ui-button-neutral-hover p-2">
                  {paymentInfoMap[payment.provider_id].icon}
                </Container>
                <Text data-testid="payment-amount">
                  {payment.provider_id === 'stripe' && payment.data.card_last4
                    ? `**** **** **** ${payment.data.card_last4}`
                    : `${formatAmount({
                        amount: payment.amount,
                        region: order.region,
                        includeTaxes: false,
                      })} paid at ${new Date(payment.created_at).toLocaleString()}`}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>

      <Divider className="mt-8" />
    </div>
  );
};

export default PaymentDetails;
