'use client';

import { Button, Heading } from '@medusajs/ui';

import DiscountCode from '@/medusa/modules/checkout/components/discount-code';
import CartTotals from '@/medusa/modules/common/components/cart-totals';
import Divider from '@/medusa/modules/common/components/divider';
import { CartWithCheckoutStep } from '@/medusa/types/global';
import Link from '@/components/atoms/Link';

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
      <Link
        href={'/checkout?step=' + cart.checkout_step}
        data-testid="checkout-button"
      >
        <Button className="h-10 w-full">Go to checkout</Button>
      </Link>
    </div>
  );
};

export default Summary;
