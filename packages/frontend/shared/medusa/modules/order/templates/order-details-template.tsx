'use client';

import { XMark } from '@medusajs/icons';
import { Order } from '@medusajs/medusa';
import React from 'react';

import Link from '@/components/atoms/Link';
import Items from '@/medusa/modules/order/components/items';
import OrderDetails from '@/medusa/modules/order/components/order-details';
import OrderSummary from '@/medusa/modules/order/components/order-summary';
import ShippingDetails from '@/medusa/modules/order/components/shipping-details';

type OrderDetailsTemplateProps = {
  order: Order;
};

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="medusa flex flex-col justify-center gap-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl-semi">Order details</h1>
        <Link
          href="/account/orders"
          className="flex items-center gap-2 text-ui-fg-subtle hover:text-ui-fg-base"
          data-testid="back-to-overview-button"
        >
          <XMark /> Back to overview
        </Link>
      </div>
      <div className="flex h-full w-full flex-col gap-4 bg-white">
        <OrderDetails
          order={order}
          showStatus
        />
        <Items
          items={order.items}
          region={order.region}
        />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
      </div>
    </div>
  );
};

export default OrderDetailsTemplate;
