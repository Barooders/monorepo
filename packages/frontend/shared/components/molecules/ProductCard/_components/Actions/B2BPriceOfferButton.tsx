'use client';

import { FetchProductForNewOfferQuery } from '@/__generated/graphql';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import { gql_b2b_user, useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import { HASURA_ROLES } from 'shared-types';
import MakeB2BOfferModal from '../MakeB2BOfferModal';

const dict = getDictionary('fr');

export const ExistingOfferComponent: React.FC<{ className?: string }> = ({
  className,
}) => {
  return (
    <Button
      disabled={true}
      intent="secondary"
      className={`mt-2 ${className}`}
    >
      {dict.b2b.productCard.existingOffer}
    </Button>
  );
};

const FETCH_PRODUCT_FOR_NEW_OFFER = gql_b2b_user`
  query fetchProductForNewOffer($productId: String!) {
    dbt_store_base_product(where: { id: { _eq: $productId } }) {
      variants {
        variant {
          inventory_quantity
          title
        }
        b2bVariant {
          price
        }
      }
      bundlePrices {
        unit_price_in_cents
        min_quantity
      }
      exposedProduct: product {
        title
        total_quantity
      }
    }
  }
`;

type PropsType = {
  productId: string;
  userCanNegociate: boolean;
  className?: string;
};

const B2BPriceOfferButton: React.FC<PropsType> = ({
  productId,
  userCanNegociate,
  className,
}) => {
  const fetchProductForNewOffer = useHasura<FetchProductForNewOfferQuery>(
    FETCH_PRODUCT_FOR_NEW_OFFER,
    HASURA_ROLES.B2B_USER,
  );

  const [{ loading, value }, doFetchProductHitData] = useWrappedAsyncFn<
    () => Promise<FetchProductForNewOfferQuery>
  >(() => fetchProductForNewOffer({ productId }));

  const MakeOfferButton: React.FC<{
    openModal: () => void;
  }> = ({ openModal }) => {
    return (
      <Button
        intent={userCanNegociate ? 'tertiary' : 'secondary'}
        onClick={() => {
          openModal();
          doFetchProductHitData();
        }}
        className="w-full"
      >
        {userCanNegociate
          ? dict.b2b.productCard.makeAnOffer.openModal
          : dict.b2b.productCard.makeAnOffer.buy}
      </Button>
    );
  };

  const product = value?.dbt_store_base_product[0];

  const getBundleUnitPriceFromQuantity = (quantity: number) => {
    const bundlePrices = product?.bundlePrices;

    const firstVariantPrice = product?.variants[0]?.b2bVariant?.price
      ? Number(product.variants[0].b2bVariant.price)
      : 0;

    if (!bundlePrices || bundlePrices.length === 0) return firstVariantPrice;

    const bundlePrice = bundlePrices
      .sort((a, b) => b.min_quantity - a.min_quantity)
      .find(
        ({ min_quantity }) => min_quantity <= quantity,
      )?.unit_price_in_cents;

    return bundlePrice ? Number(bundlePrice) / 100 : firstVariantPrice;
  };

  return (
    <div className={className}>
      <Modal
        ButtonComponent={MakeOfferButton}
        ContentComponent={({ closeModal }) =>
          loading ? (
            <Loader />
          ) : product ? (
            <MakeB2BOfferModal
              userCanNegociate={userCanNegociate}
              closeModal={closeModal}
              productId={productId}
              productName={product.exposedProduct?.title ?? ''}
              variants={
                product.variants.map(({ variant }) => ({
                  title: variant?.title ?? '',
                  quantity: variant?.inventory_quantity ?? 0,
                })) ?? []
              }
              totalQuantity={product.exposedProduct?.total_quantity ?? 0}
              getBundleUnitPriceFromQuantity={getBundleUnitPriceFromQuantity}
            />
          ) : (
            <></>
          )
        }
      />
    </div>
  );
};

export default B2BPriceOfferButton;
