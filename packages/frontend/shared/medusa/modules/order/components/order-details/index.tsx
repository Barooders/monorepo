import { getDictionary } from '@/i18n/translate';
import { Order } from '@medusajs/medusa';
import { Text } from '@medusajs/ui';

const dict = getDictionary('fr');

type OrderDetailsProps = {
  order: Order;
  showStatus?: boolean;
};

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split('_').join(' ');

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1);
  };

  return (
    <div>
      <Text>
        {dict.checkout.thankYouPage.emailSentTo}
        <span
          className="text-ui-fg-medium-plus font-semibold"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2">
        {dict.checkout.thankYouPage.orderDate}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        {dict.checkout.thankYouPage.orderNumber}
        <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="text-compact-small mt-4 flex items-center gap-x-4">
        {showStatus && (
          <>
            <Text>
              {dict.checkout.thankYouPage.orderStatus}{' '}
              <span
                className="text-ui-fg-subtle "
                data-testid="order-status"
              >
                {formatStatus(order.fulfillment_status)}
              </span>
            </Text>
            <Text>
              {dict.checkout.thankYouPage.paymentStatus}{' '}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {formatStatus(order.payment_status)}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
