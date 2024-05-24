'use client';

import { Heading, Text, clx } from '@medusajs/ui';

import { getDictionary } from '@/i18n/translate';
import { Cart } from '@medusajs/medusa';
import { useSearchParams } from 'next/navigation';
import PaymentButton from '../payment-button';

const dict = getDictionary('fr');

const Review = ({
  cart,
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
}) => {
  const searchParams = useSearchParams();

  const isOpen = searchParams?.get('step') === 'review';

  const previousStepsCompleted =
    cart.shipping_address &&
    cart.shipping_methods.length > 0 &&
    cart.payment_session;

  return (
    <div className="bg-white">
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className={clx(
            'text-3xl-regular flex flex-row items-baseline gap-x-2',
            {
              'pointer-events-none select-none opacity-50': !isOpen,
            },
          )}
        >
          {dict.checkout.review.title}
        </Heading>
      </div>
      {isOpen && previousStepsCompleted && (
        <>
          <div className="mb-6 flex w-full items-start gap-x-1">
            <div className="w-full">
              <Text className="txt-medium-plus mb-1 text-ui-fg-base">
                {dict.checkout.review.agreement}
              </Text>
            </div>
          </div>
          <PaymentButton
            cart={cart}
            data-testid="submit-order-button"
          />
        </>
      )}
    </div>
  );
};

export default Review;
