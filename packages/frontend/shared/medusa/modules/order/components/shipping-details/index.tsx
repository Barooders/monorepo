import { formatAmount } from '@/medusa/lib/util/prices';
import { Order } from '@medusajs/medusa';
import { Heading, Text } from '@medusajs/ui';

import { getDictionary } from '@/i18n/translate';
import Divider from '@/medusa/modules/common/components/divider';

const dict = getDictionary('fr');

type ShippingDetailsProps = {
  order: Order;
};

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div>
      <Heading
        level="h2"
        className="text-3xl-regular my-6 flex flex-row"
      >
        {dict.checkout.shippingAddress.title}
      </Heading>
      <div className="flex items-start gap-x-8">
        <div
          className="flex w-1/3 flex-col"
          data-testid="shipping-address-summary"
        >
          <Text className="txt-medium-plus mb-1 text-ui-fg-base">
            {dict.checkout.shippingAddress.address}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.first_name}{' '}
            {order.shipping_address.last_name}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.address_1}{' '}
            {order.shipping_address.address_2}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.postal_code}, {order.shipping_address.city}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.country_code?.toUpperCase()}
          </Text>
        </div>

        <div
          className="flex w-1/3 flex-col "
          data-testid="shipping-contact-summary"
        >
          <Text className="txt-medium-plus mb-1 text-ui-fg-base">
            {dict.checkout.shippingAddress.contact}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_address.phone}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">{order.email}</Text>
        </div>

        <div
          className="flex w-1/3 flex-col"
          data-testid="shipping-method-summary"
        >
          <Text className="txt-medium-plus mb-1 text-ui-fg-base">
            {dict.checkout.shippingAddress.method}
          </Text>
          <Text className="txt-medium text-ui-fg-subtle">
            {order.shipping_methods[0].shipping_option?.name} (
            {formatAmount({
              amount: order.shipping_methods[0].price,
              region: order.region,
              includeTaxes: false,
            })
              .replace(/,/g, '')
              .replace(/\./g, ',')}
            )
          </Text>
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default ShippingDetails;
