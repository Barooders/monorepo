import MedusaProvider from '@/providers/MedusaProvider';
import { LineItem } from '@medusajs/medusa';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

import Link from '@/components/atoms/Link';
import BaroodersLogo from '@/components/icons/BaroodersLogo';
import { getCart } from '@/medusa/lib/data';
import { enrichLineItems } from '@/medusa/modules/cart/actions';
import Wrapper from '@/medusa/modules/checkout/components/payment-wrapper';
import CheckoutForm from '@/medusa/modules/checkout/templates/checkout-form';
import CheckoutSummary from '@/medusa/modules/checkout/templates/checkout-summary';

export const metadata: Metadata = {
  title: 'Checkout',
  robots: {
    index: false,
    follow: false,
  },
};

const fetchCart = async () => {
  const cartId = cookies().get('_medusa_cart_id')?.value;

  if (cartId === undefined) {
    return notFound();
  }

  const cart = await getCart(cartId).then((cart) => cart);

  if (cart?.items !== undefined && cart?.items.length > 0) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id);
    cart.items = enrichedItems as LineItem[];
  }

  return cart;
};

export default async function Checkout() {
  const cart = await fetchCart();

  if (!cart) {
    return notFound();
  }

  return (
    <MedusaProvider>
      <div className="content-container flex h-20 items-center">
        <Link
          href="/"
          className="flex w-[225px] items-center"
        >
          <BaroodersLogo />
        </Link>
      </div>
      <div className="content-container grid grid-cols-1 gap-x-40 py-6 small:grid-cols-[1fr_416px]">
        <Wrapper cart={cart}>
          <CheckoutForm />
        </Wrapper>
        <CheckoutSummary />
      </div>
    </MedusaProvider>
  );
}
