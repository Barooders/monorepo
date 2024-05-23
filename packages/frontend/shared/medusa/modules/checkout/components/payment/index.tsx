'use client';

import ErrorMessage from '@/medusa/modules/checkout/components/error-message';
import { RadioGroup } from '@headlessui/react';
import { CheckCircleSolid, CreditCard } from '@medusajs/icons';
import { Cart } from '@medusajs/medusa';
import { Button, Container, Heading, Text, Tooltip, clx } from '@medusajs/ui';
import { CardElement } from '@stripe/react-stripe-js';
import { StripeCardElementOptions } from '@stripe/stripe-js';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { paymentInfoMap } from '@/medusa/lib/constants';
import { setPaymentMethod } from '@/medusa/modules/checkout/actions';
import PaymentContainer from '@/medusa/modules/checkout/components/payment-container';
import { StripeContext } from '@/medusa/modules/checkout/components/payment-wrapper';
import Divider from '@/medusa/modules/common/components/divider';
import Spinner from '@/medusa/modules/common/icons/spinner';

const Payment = ({
  cart,
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardBrand, setCardBrand] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isOpen = searchParams?.get('step') === 'payment';

  const isStripe = cart?.payment_session?.provider_id === 'stripe';
  const stripeReady = useContext(StripeContext);

  const paymentReady =
    cart?.payment_session && cart?.shipping_methods.length !== 0;

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: 'Inter, sans-serif',
          color: '#424270',
          '::placeholder': {
            color: 'rgb(107 114 128)',
          },
        },
      },
      classes: {
        base: 'pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out',
      },
    };
  }, []);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams ?? {});
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const set = async (providerId: string) => {
    setIsLoading(true);
    await setPaymentMethod(providerId)
      .catch((err) => setError(err.toString()))
      .finally(() => {
        if (providerId === 'paypal') return;
        setIsLoading(false);
      });
  };

  const handleChange = (providerId: string) => {
    setError(null);
    set(providerId);
  };

  const handleEdit = () => {
    router.push(pathname + '?' + createQueryString('step', 'payment'), {
      scroll: false,
    });
  };

  const handleSubmit = () => {
    setIsLoading(true);
    router.push(pathname + '?' + createQueryString('step', 'review'), {
      scroll: false,
    });
  };

  useEffect(() => {
    setIsLoading(false);
    setError(null);
  }, [isOpen]);

  return (
    <div className="bg-white">
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className={clx(
            'text-3xl-regular flex flex-row items-baseline gap-x-2',
            {
              'pointer-events-none select-none opacity-50':
                !isOpen && !paymentReady,
            },
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        {cart?.payment_sessions?.length ? (
          <div className={isOpen ? 'block' : 'hidden'}>
            <RadioGroup
              value={cart.payment_session?.provider_id || ''}
              onChange={(value: string) => handleChange(value)}
            >
              {cart.payment_sessions
                .sort((a, b) => {
                  return a.provider_id > b.provider_id ? 1 : -1;
                })
                .map((paymentSession) => {
                  return (
                    <PaymentContainer
                      paymentInfoMap={paymentInfoMap}
                      paymentSession={paymentSession}
                      key={paymentSession.id}
                      selectedPaymentOptionId={
                        cart.payment_session?.provider_id || null
                      }
                    />
                  );
                })}
            </RadioGroup>

            {isStripe && stripeReady && (
              <div className="mt-5 transition-all duration-150 ease-in-out">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Enter your card details:
                </Text>

                <CardElement
                  options={useOptions as StripeCardElementOptions}
                  onChange={(e) => {
                    setCardBrand(
                      e.brand &&
                        e.brand.charAt(0).toUpperCase() + e.brand.slice(1),
                    );
                    setError(e.error?.message || null);
                    setCardComplete(e.complete);
                  }}
                />
              </div>
            )}

            <ErrorMessage
              error={error}
              data-testid="payment-method-error-message"
            />

            <Button
              size="large"
              className="mt-6"
              onClick={handleSubmit}
              isLoading={isLoading}
              disabled={(isStripe && !cardComplete) || !cart.payment_session}
              data-testid="submit-payment-button"
            >
              Continue to review
            </Button>
          </div>
        ) : (
          <div className="text-ui-fg-base flex flex-col items-center justify-center px-4 py-16">
            <Spinner />
          </div>
        )}

        <div className={isOpen ? 'hidden' : 'block'}>
          {cart && paymentReady && cart.payment_session && (
            <div className="flex w-full items-start gap-x-1">
              <div className="flex w-1/3 flex-col">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[cart.payment_session.provider_id]?.title ||
                    cart.payment_session.provider_id}
                </Text>
                {process.env.NODE_ENV === 'development' &&
                  !Object.hasOwn(
                    paymentInfoMap,
                    cart.payment_session.provider_id,
                  ) && (
                    <Tooltip content="You can add a user-friendly name and icon for this payment provider in 'src/modules/checkout/components/payment/index.tsx'" />
                  )}
              </div>
              <div className="flex w-1/3 flex-col">
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="txt-medium text-ui-fg-subtle flex items-center gap-2"
                  data-testid="payment-details-summary"
                >
                  <Container className="bg-ui-button-neutral-hover flex h-7 w-fit items-center p-2">
                    {paymentInfoMap[cart.payment_session.provider_id]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  <Text>
                    {cart.payment_session.provider_id === 'stripe' && cardBrand
                      ? cardBrand
                      : 'Another step will appear'}
                  </Text>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  );
};

export default Payment;
