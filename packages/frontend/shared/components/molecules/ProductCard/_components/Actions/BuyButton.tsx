'use client';

import { sendBeginCheckout } from '@/analytics';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import useUser from '@/hooks/state/useUser';
import { useAuth } from '@/hooks/useAuth';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import useStorefront, {
  ASSOCIATE_CHECKOUT,
  CREATE_CHECKOUT,
} from '@/hooks/useStorefront';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from '@/hooks/useBackend';
import { getDictionary } from '@/i18n/translate';
import { toStorefrontId } from '@/utils/shopifyId';
import { useEffect } from 'react';
import { ProductSingleVariant } from '../../types';
import { operations } from '@/__generated/rest-schema';

const dict = getDictionary('fr');

const BuyButton: React.FC<{
  variant: ProductSingleVariant['variantShopifyId'];
  className?: string;
}> = ({ variant, className }) => {
  const { hasuraToken } = useUser();
  const { getShopifyToken } = useAuth();
  const { isLoggedIn } = useIsLoggedIn();
  const { fetchAPI } = useBackend();
  const createCheckout = useStorefront<{
    checkoutCreate: {
      checkout: {
        id: string;
        webUrl: string;
      };
      checkoutUserErrors: {
        message: string;
      };
    };
  }>(CREATE_CHECKOUT);

  const associateCheckout = useStorefront<{
    checkoutCreate: {
      checkout: {
        id: string;
        webUrl: string;
      };
      checkoutUserErrors: {
        message: string;
      };
    };
  }>(ASSOCIATE_CHECKOUT);

  const [createState, doCreate] = useWrappedAsyncFn(
    async (variantId: string) => {
      const commissionBody: operations['BuyerCommissionController_createAndPublishCommissionProduct']['requestBody']['content']['application/json'] =
        {
          cartLineIds: [variantId],
        };
      const commissionProduct = await fetchAPI<
        operations['BuyerCommissionController_createAndPublishCommissionProduct']['responses']['default']['content']['application/json']
      >('/v1/commission/create', {
        method: 'POST',
        body: JSON.stringify(commissionBody),
      });

      const input: {
        allowPartialAddresses?: boolean;
        lineItems: { quantity: number; variantId: string }[];
        email?: string;
      } = {
        allowPartialAddresses: true,
        lineItems: [
          {
            quantity: 1,
            variantId: toStorefrontId(variantId, 'ProductVariant'),
          },
          {
            quantity: 1,
            variantId: toStorefrontId(
              commissionProduct.variantStoreId,
              'ProductVariant',
            ),
          },
        ],
      };

      if (hasuraToken?.user.email) {
        input.email = hasuraToken.user.email;
      }

      const createCheckoutResponse = await createCheckout({
        input,
      });

      if (isLoggedIn) {
        await associateCheckout({
          checkoutId: createCheckoutResponse.checkoutCreate.checkout.id,
          customerAccessToken: await getShopifyToken(),
        });
      }

      return createCheckoutResponse.checkoutCreate.checkout.webUrl;
    },
    [hasuraToken, createCheckout],
  );

  useEffect(() => {
    if (createState.value) {
      window.location.href = createState.value;
    }
  }, [createState.value]);

  if (!variant) return <></>;

  const onClick = () => {
    sendBeginCheckout(variant ?? '');
    doCreate(variant);
  };

  return (
    <Button
      className={`flex flex-grow text-sm uppercase ${className} items-center justify-center`}
      intent="secondary"
      onClick={onClick}
    >
      {createState.loading || createState.value ? (
        <Loader />
      ) : (
        dict.components.productCard.buyNow
      )}
    </Button>
  );
};

export default BuyButton;
