'use client';

import { graphql } from '@/__generated/gql/public';
import { operations } from '@/__generated/rest-schema';
import { sendBeginCheckout } from '@/analytics';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import envConfig from '@/config/env';
import useUser from '@/hooks/state/useUser';
import { useAuth } from '@/hooks/useAuth';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import useStorefront, {
  ASSOCIATE_CHECKOUT,
  CREATE_CHECKOUT,
} from '@/hooks/useStorefront';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { createSingleItemCart } from '@/medusa/modules/cart/actions';
import { toStorefrontId } from '@/utils/shopifyId';
import { useEffect } from 'react';

const dict = getDictionary('fr');

const FETCH_VARIANT = /* GraphQL */ /* typed_for_public */ `
  query fetchVariant($internalId: String!) {
    ProductVariant(where: { id: { _eq: $internalId } }) {
      medusaId
      shopifyId
    }
  }
`;

const BuyButton: React.FC<{
  variantInternalId: string;
  productMerchantItemId: string;
  className?: string;
}> = ({ variantInternalId, productMerchantItemId, className }) => {
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
  const fetchVariant = useHasura(graphql(FETCH_VARIANT));
  const [{ value: fetchedVariant }, doFetchVariant] =
    useWrappedAsyncFn(fetchVariant);

  useEffect(() => {
    doFetchVariant();
  }, []);

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

  const createShopifyCheckout = async () => {
    const variantShopifyId = fetchedVariant?.ProductVariant[0].shopifyId;
    if (variantShopifyId === null || variantShopifyId === undefined)
      throw new Error('Variant not found');

    const commissionBody: operations['BuyerCommissionController_createAndPublishCommissionProduct']['requestBody']['content']['application/json'] =
      {
        singleCartLineInternalId: variantInternalId,
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

    if (hasuraToken?.user.email !== undefined) {
      input.email = hasuraToken.user.email;
    }

    const createCheckoutResponse = await createCheckout({
      input,
    });

    if (Boolean(isLoggedIn)) {
      await associateCheckout({
        checkoutId: createCheckoutResponse.checkoutCreate.checkout.id,
        customerAccessToken: await getShopifyToken(),
      });
    }

    return createCheckoutResponse.checkoutCreate.checkout.webUrl;
  };

  const createMedusaCheckout = async () => {
    const variantMedusaId = fetchedVariant?.ProductVariant[0].medusaId;
    if (variantMedusaId === null || variantMedusaId === undefined)
      throw new Error('Variant not found');

    await createSingleItemCart({
      variantId: variantMedusaId,
      countryCode: 'fr',
    });

    return '/checkout?step=address';
  };

  const [createState, doCreate] = useWrappedAsyncFn(
    Boolean(envConfig.features.medusaCheckout)
      ? createMedusaCheckout
      : createShopifyCheckout,
    [hasuraToken, createCheckout],
  );

  useEffect(() => {
    if (createState.value !== undefined) {
      window.location.href = createState.value;
    }
  }, [createState.value]);

  const onClick = () => {
    sendBeginCheckout({ productMerchantItemId });
    doCreate();
  };

  return (
    fetchedVariant !== undefined && (
      <Button
        className={`flex flex-grow text-sm uppercase ${className} items-center justify-center`}
        intent="secondary"
        onClick={onClick}
      >
        {createState.loading || createState.value !== undefined ? (
          <Loader />
        ) : (
          dict.components.productCard.buyNow
        )}
      </Button>
    )
  );
};

export default BuyButton;
