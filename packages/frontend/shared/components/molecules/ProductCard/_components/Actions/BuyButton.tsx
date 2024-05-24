'use client';

import { operations } from '@/__generated/rest-schema';
import { sendBeginCheckout } from '@/analytics';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import useUser from '@/hooks/state/useUser';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import useStorefront, {
  ASSOCIATE_CHECKOUT,
  CREATE_CHECKOUT,
} from '@/hooks/useStorefront';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { medusaClient } from '@/medusa/lib/config';
import { createSingleItemCart } from '@/medusa/modules/cart/actions';
import { toStorefrontId } from '@/utils/shopifyId';
import first from 'lodash/first';
import { useEffect } from 'react';

const USE_MEDUSA_CHECKOUT = true;

const dict = getDictionary('fr');

const BuyButton: React.FC<{
  variantShopifyId: number;
  handle: string;
  className?: string;
}> = ({ variantShopifyId, className, handle }) => {
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

  const createShopifyCheckout = async (variantShopifyId: number) => {
    const commissionBody: operations['BuyerCommissionController_createAndPublishCommissionProduct']['requestBody']['content']['application/json'] =
      {
        cartLineIds: [variantShopifyId.toString()],
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
          variantId: toStorefrontId(variantShopifyId, 'ProductVariant'),
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
  };

  const createMedusaCheckout = async () => {
    const { products } = await medusaClient.products.list({ handle });
    const medusaVariantId = first(first(products)?.variants)?.id;
    if (!medusaVariantId) {
      throw new Error('Product does not exist in medusa');
    }

    await createSingleItemCart({
      variantId: medusaVariantId,
      countryCode: 'fr',
    });

    return '/checkout';
  };

  const [createState, doCreate] = useWrappedAsyncFn(
    USE_MEDUSA_CHECKOUT ? createMedusaCheckout : createShopifyCheckout,
    [hasuraToken, createCheckout],
  );

  useEffect(() => {
    if (createState.value) {
      window.location.href = createState.value;
    }
  }, [createState.value]);

  const onClick = () => {
    sendBeginCheckout(variantShopifyId ?? '');
    doCreate(variantShopifyId);
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
