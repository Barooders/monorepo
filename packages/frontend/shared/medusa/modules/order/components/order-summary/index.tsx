import { Order } from '@medusajs/medusa';
import { formatAmount } from '@/medusa/lib/util/prices';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type OrderSummaryProps = {
  order: Order;
};

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return;
    }

    return formatAmount({ amount, region: order.region, includeTaxes: false });
  };

  return (
    <div>
      <h2 className="text-base-semi">{dict.checkout.order.summary}</h2>
      <div className="text-small-regular my-2 text-ui-fg-base">
        <div className="text-base-regular mb-2 flex items-center justify-between text-ui-fg-base">
          <span>{dict.checkout.order.subTotal}</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        <div className="flex flex-col gap-y-1">
          {order.discount_total > 0 && (
            <div className="flex items-center justify-between">
              <span>{dict.checkout.order.discountTotal}</span>
              <span>- {getAmount(order.discount_total)}</span>
            </div>
          )}
          {order.gift_card_total > 0 && (
            <div className="flex items-center justify-between">
              <span>{dict.checkout.order.giftCard}</span>
              <span>- {getAmount(order.gift_card_total)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span>{dict.checkout.order.shipping}</span>
            <span>{getAmount(order.shipping_total)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>{dict.checkout.order.taxes}</span>
            <span>{getAmount(order.tax_total)}</span>
          </div>
        </div>
        <div className="my-4 h-px w-full border-b border-dashed border-gray-200" />
        <div className="text-base-regular mb-2 flex items-center justify-between text-ui-fg-base">
          <span>{dict.checkout.order.total}</span>
          <span>{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
