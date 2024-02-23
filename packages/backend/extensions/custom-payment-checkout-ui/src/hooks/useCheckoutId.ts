import { useState } from 'react';
import useBackend from './useBackend';
import useCartInfo from './useCartInfo';
import useCheckoutAttribute from './useCheckoutAttribute';

const delay = (time: number) => new Promise((then) => setTimeout(then, time));

const CHECKOUT_ID = 'checkoutId';
let ongoingCreate = false;

const useCheckoutId = () => {
  const [checkoutId, setCheckoutId] = useCheckoutAttribute(CHECKOUT_ID);
  const fetchBackend = useBackend();
  const cartInfo = useCartInfo();

  return async () => {
    if (checkoutId) return checkoutId;

    while (ongoingCreate) {
      await delay(2000);
    }

    ongoingCreate = true;

    const checkout = await fetchBackend<{ id: string }>(
      '/v1/buy/payment/checkout',
      {
        method: 'POST',
        body: JSON.stringify(cartInfo),
      },
    );

    setCheckoutId(checkout.id);

    ongoingCreate = false;

    return checkout.id;
  };
};

export default useCheckoutId;
