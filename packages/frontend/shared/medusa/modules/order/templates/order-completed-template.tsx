import { getDictionary } from '@/i18n/translate';
import CartTotals from '@/medusa/modules/common/components/cart-totals';
import Items from '@/medusa/modules/order/components/items';
import OrderDetails from '@/medusa/modules/order/components/order-details';
import PaymentDetails from '@/medusa/modules/order/components/payment-details';
import ShippingDetails from '@/medusa/modules/order/components/shipping-details';
import { Order } from '@medusajs/medusa';
import { Heading } from '@medusajs/ui';

const dict = getDictionary('fr');

type OrderCompletedTemplateProps = {
  order: Order;
};

export default function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <div className="min-h-[calc(100vh-64px)] py-6">
      <div className="content-container flex h-full w-full max-w-4xl flex-col items-center justify-center gap-y-10">
        <div
          className="flex h-full w-full max-w-4xl flex-col gap-4 bg-white py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="mb-4 flex flex-col gap-y-3 text-3xl text-ui-fg-base"
          >
            <span>{dict.checkout.thankYouPage.title}</span>
            <span>{dict.checkout.thankYouPage.subtitle}</span>
          </Heading>
          <OrderDetails order={order} />
          <Heading
            level="h2"
            className="text-3xl-regular flex flex-row"
          >
            {dict.checkout.thankYouPage.summary}
          </Heading>
          <Items
            items={order.items}
            region={order.region}
          />
          <CartTotals data={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
        </div>
      </div>
    </div>
  );
}
