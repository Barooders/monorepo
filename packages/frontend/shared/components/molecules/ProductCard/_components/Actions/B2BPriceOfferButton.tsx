'use client';

import { FetchProductForNewOfferQuery } from '@/__generated/graphql';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import React from 'react';
import { HASURA_ROLES } from 'shared-types';
import MakeB2BOfferModal from '../MakeB2BOfferModal';

const dict = getDictionary('fr');

const FETCH_PRODUCT_FOR_NEW_OFFER = gql`
  query fetchProductForNewOffer($productId: String!) {
    dbt_store_b2b_product(where: { id: { _eq: $productId } }) {
      product {
        variants {
          b2bVariant {
            inventory_quantity
            price
            title
          }
        }
      }
      total_quantity
      title
    }
    BundlePrice(where: { productId: { _eq: $productId } }) {
      minQuantity
      unitPriceInCents
    }
  }
`;

type PropsType = {
  productId: string;
  hasOpenedPriceOffer: boolean;
};

const B2BPriceOfferButton: React.FC<PropsType> = ({
  hasOpenedPriceOffer,
  productId,
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
        intent="tertiary"
        onClick={() => {
          openModal();
          doFetchProductHitData();
        }}
        className="mt-2"
      >
        {dict.b2b.productCard.makeAnOffer.openModal}
      </Button>
    );
  };

  const ExistingOfferComponent: React.FC = () => {
    return (
      <Button
        disabled={true}
        intent="secondary"
        className="mt-2"
      >
        {dict.b2b.productCard.existingOffer}
      </Button>
    );
  };

  const product = value?.dbt_store_b2b_product[0];

  const getBundleUnitPriceFromQuantity = (quantity: number) => {
    const bundlePrices = value?.BundlePrice;
    const firstVariantPrice = product?.product?.variants[0]?.b2bVariant?.price
      ? Number(product.product.variants[0].b2bVariant.price)
      : 0;

    if (!bundlePrices || bundlePrices.length === 0) return firstVariantPrice;

    const bundlePrice = bundlePrices
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find(({ minQuantity }) => minQuantity <= quantity)?.unitPriceInCents;

    return bundlePrice ? Number(bundlePrice) / 100 : firstVariantPrice;
  };

  return (
    <Modal
      ButtonComponent={
        hasOpenedPriceOffer ? ExistingOfferComponent : MakeOfferButton
      }
      ContentComponent={({ closeModal }) =>
        loading ? (
          <Loader />
        ) : product ? (
          <MakeB2BOfferModal
            closeModal={closeModal}
            productId={productId}
            productName={product.title}
            variants={
              product.product?.variants.map(({ b2bVariant }) => ({
                title: b2bVariant?.title ?? '',
                quantity: b2bVariant?.inventory_quantity ?? 0,
              })) ?? []
            }
            totalQuantity={product.total_quantity}
            getBundleUnitPriceFromQuantity={getBundleUnitPriceFromQuantity}
          />
        ) : (
          <></>
        )
      }
    />
  );
};

export default B2BPriceOfferButton;
