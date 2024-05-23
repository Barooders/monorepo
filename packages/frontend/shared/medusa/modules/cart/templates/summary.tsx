'use client';

import { Button, Heading } from '@medusajs/ui';

import DiscountCode from '@/medusa/modules/checkout/components/discount-code';
import CartTotals from '@/medusa/modules/common/components/cart-totals';
import Divider from '@/medusa/modules/common/components/divider';
import LocalizedClientLink from '@/medusa/modules/common/components/localized-client-link';
import { CartWithCheckoutStep } from '@/medusa/types/global';

type SummaryProps = {
  cart: CartWithCheckoutStep;
};

const Summary = ({ cart }: SummaryProps) => {
  return (
    <div className="flex flex-col gap-y-4">
      <Heading
        level="h2"
        className="text-[2rem] leading-[2.75rem]"
      >
        Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider />
      <CartTotals data={cart} />
      <LocalizedClientLink
        href={'/checkout?step=' + cart.checkout_step}
        data-testid="checkout-button"
      >
        <Button className="h-10 w-full">Go to checkout</Button>
      </LocalizedClientLink>
    </div>
  );
};

export default Summary;
