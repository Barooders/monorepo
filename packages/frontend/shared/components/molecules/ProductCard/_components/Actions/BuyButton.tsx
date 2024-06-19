'use client';

import { graphql } from '@/__generated/gql/public';
import { operations } from '@/__generated/rest-schema';
import { sendBeginCheckout } from '@/analytics';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import envConfig from '@/config/env';
import useUser from '@/hooks/state/useUser';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { addToCart, createSingleItemCart } from '@/medusa/modules/cart/actions';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';

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
  const { fetchAPI } = useBackend();
  const fetchVariant = useHasura(graphql(FETCH_VARIANT), HASURA_ROLES.PUBLIC);
  const [{ value: fetchedVariant }, doFetchVariant] = useWrappedAsyncFn(() =>
    fetchVariant({ internalId: variantInternalId }),
  );

  useEffect(() => {
    doFetchVariant();
  }, []);

  // TODO: Remove if you want to sell
  if (!envConfig.features.buyButton) {
    return <></>;
  }

  const createCommissionOnStore = async () => {
    const variantShopifyId = fetchedVariant?.ProductVariant[0].shopifyId;
    if (variantShopifyId === null || variantShopifyId === undefined)
      throw new Error('Variant not found');

    const commissionBody: operations['BuyerCommissionController_createAndPublishCommissionProduct']['requestBody']['content']['application/json'] =
      {
        singleCartLineInternalId: variantInternalId,
      };
    return await fetchAPI<
      operations['BuyerCommissionController_createAndPublishCommissionProduct']['responses']['default']['content']['application/json']
    >('/v1/commission/create', {
      method: 'POST',
      body: JSON.stringify(commissionBody),
    });
  };

  const createMedusaCheckout = async () => {
    const variantMedusaId = fetchedVariant?.ProductVariant[0].medusaId;
    if (variantMedusaId === null || variantMedusaId === undefined)
      throw new Error('Variant not found');

    const { variantMedusaId: commissionMedusaId } =
      await createCommissionOnStore();

    await createSingleItemCart({
      variantId: variantMedusaId,
      countryCode: 'fr',
    });

    await addToCart({
      variantId: commissionMedusaId,
      quantity: 1,
      countryCode: 'fr',
    });

    return '/checkout?step=address';
  };

  const [createState, doCreate] = useWrappedAsyncFn(createMedusaCheckout, [
    hasuraToken,
    createMedusaCheckout,
  ]);

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
