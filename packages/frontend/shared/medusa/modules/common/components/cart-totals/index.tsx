'use client';

import { formatAmount } from '@/medusa/lib/util/prices';
import { InformationCircleSolid } from '@medusajs/icons';
import { Cart, Order } from '@medusajs/medusa';
import { Tooltip } from '@medusajs/ui';
import React from 'react';

type CartTotalsProps = {
  data: Omit<Cart, 'refundable_amount' | 'refunded_total'> | Order;
};

const CartTotals: React.FC<CartTotalsProps> = ({ data }) => {
  const {
    subtotal,
    discount_total,
    gift_card_total,
    tax_total,
    shipping_total,
    total,
  } = data;

  const getAmount = (amount: number | null | undefined) => {
    return formatAmount({
      amount: amount || 0,
      region: data.region,
      includeTaxes: false,
    });
  };

  return (
    <div>
      <div className="txt-medium text-ui-fg-subtle flex flex-col gap-y-2 ">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-x-1">
            Subtotal
            <Tooltip content="Cart total excluding shipping and taxes.">
              <InformationCircleSolid color="var(--fg-muted)" />
            </Tooltip>
          </span>
          <span
            data-testid="cart-subtotal"
            data-value={subtotal || 0}
          >
            {getAmount(subtotal)}
          </span>
        </div>
        {!!discount_total && (
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-discount"
              data-value={discount_total || 0}
            >
              - {getAmount(discount_total)}
            </span>
          </div>
        )}
        {!!gift_card_total && (
          <div className="flex items-center justify-between">
            <span>Gift card</span>
            <span
              className="text-ui-fg-interactive"
              data-testid="cart-gift-card-amount"
              data-value={gift_card_total || 0}
            >
              - {getAmount(gift_card_total)}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span
            data-testid="cart-shipping"
            data-value={shipping_total || 0}
          >
            {getAmount(shipping_total)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-x-1 ">Taxes</span>
          <span
            data-testid="cart-taxes"
            data-value={tax_total || 0}
          >
            {getAmount(tax_total)}
          </span>
        </div>
      </div>
      <div className="my-4 h-px w-full border-b border-gray-200" />
      <div className="text-ui-fg-base txt-medium mb-2 flex items-center justify-between ">
        <span>Total</span>
        <span
          className="txt-xlarge-plus"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {getAmount(total)}
        </span>
      </div>
      <div className="mt-4 h-px w-full border-b border-gray-200" />
    </div>
  );
};

export default CartTotals;
