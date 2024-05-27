import { Button, Text } from '@medusajs/ui';
import { useAdminProduct, useCreateCart, useMedusa } from 'medusa-react';
import { useEffect, useState } from 'react';
import isEmpty from '../../../../utils/is-empty';
import prepareRegions from '../../../../utils/prepare-region';
import prepareShippingOptions from '../../../../utils/prepare-shipping-options';
import { StepContentProps } from '../../../../widgets/onboarding-flow/onboarding-flow';

const OrdersListNextjs = ({ isComplete, data }: StepContentProps) => {
  if (data === undefined) {
    return null;
  }

  const { product } = useAdminProduct(data.product_id);

  if (product === undefined) {
    return null;
  }

  const { mutateAsync: createCart, isLoading: cartIsLoading } = useCreateCart();
  const { client } = useMedusa();
  const [cartId, setCartId] = useState<string | null>(null);

  const prepareNextjsCheckout = async () => {
    const variant = product.variants[0] ?? null;
    try {
      const regions = await prepareRegions(client);
      await prepareShippingOptions(client, regions[0]);
      const { cart } = await createCart({
        region_id: regions[0]?.id,
        items: [
          {
            variant_id: variant?.id,
            quantity: 1,
          },
        ],
      });

      setCartId(cart?.id);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  useEffect(() => {
    if (isEmpty(cartId) && product !== undefined) {
      prepareNextjsCheckout();
    }
  }, [cartId, product]);

  return (
    <>
      <div className="mb-6 flex flex-col gap-2">
        <Text>
          The last step is to create a sample order using one of your products.
          You can then view your order’s details, process its payment,
          fulfillment, inventory, and more.
        </Text>
        <Text>
          You can use the button below to experience hand-first the checkout
          flow in the Next.js storefront. After placing the order in the
          storefront, you’ll be directed back here to view the order’s details.
        </Text>
      </div>
      <div className="flex gap-2">
        {!(isComplete ?? false) && (
          <a
            href={`http://localhost:8000/checkout?cart_id=${cartId}&onboarding=true`}
            target="_blank"
          >
            <Button
              variant="primary"
              size="base"
              isLoading={isEmpty(cartId) || cartIsLoading}
            >
              Place an order in your storefront
            </Button>
          </a>
        )}
      </div>
    </>
  );
};

export default OrdersListNextjs;
