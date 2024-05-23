import { Heading } from '@medusajs/ui';

import { getCart } from '@/medusa/lib/data';
import ItemsPreviewTemplate from '@/medusa/modules/cart/templates/preview';
import DiscountCode from '@/medusa/modules/checkout/components/discount-code';
import CartTotals from '@/medusa/modules/common/components/cart-totals';
import Divider from '@/medusa/modules/common/components/divider';
import { cookies } from 'next/headers';

const CheckoutSummary = async () => {
  const cartId = cookies().get('_medusa_cart_id')?.value;

  if (!cartId) {
    return null;
  }

  const cart = await getCart(cartId).then((cart) => cart);

  if (!cart) {
    return null;
  }

  return (
    <div className="small:flex-col small:py-0 sticky top-0 flex flex-col-reverse gap-y-8 py-8 ">
      <div className="flex w-full flex-col bg-white">
        <Divider className="small:hidden my-6" />
        <Heading
          level="h2"
          className="text-3xl-regular flex flex-row items-baseline"
        >
          In your Cart
        </Heading>
        <Divider className="my-6" />
        <CartTotals data={cart} />
        <ItemsPreviewTemplate
          region={cart?.region}
          items={cart?.items}
        />
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutSummary;
