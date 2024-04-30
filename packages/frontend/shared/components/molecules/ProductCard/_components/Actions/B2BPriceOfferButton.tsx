'use client';

import { graphql } from '@/__generated/gql/b2b_user';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import useOpenedOffersState from '@/components/pages/ProPage/_state/useOpenedOffersState';
import { useHasura } from '@/hooks/useHasura';
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
      className={`w-full ${className}`}
    >
      {dict.b2b.productCard.existingOffer}
    </Button>
  );
};

const FETCH_PRODUCT_FOR_NEW_OFFER = /* GraphQL */ /* typed_for_b2b_user */ `
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
  vendorId: string;
  className?: string;
  openDetails: (productInternalId: string) => void;
};

const B2BPriceOfferButton: React.FC<PropsType> = ({
  productId,
  vendorId,
  className,
  openDetails,
}) => {
  const fetchProductForNewOffer = useHasura(
    graphql(FETCH_PRODUCT_FOR_NEW_OFFER),
    HASURA_ROLES.B2B_USER,
  );

  const [{ loading, value }, doFetchProductHitData] = useWrappedAsyncFn(() =>
    fetchProductForNewOffer({ productId }),
  );

  const MakeOfferButton: React.FC<{
    openModal: () => void;
  }> = ({ openModal }) => {
    const { hasOpenedPriceOffer } = useOpenedOffersState();

    return hasOpenedPriceOffer(productId) ? (
      <></>
    ) : (
      <Button
        intent="secondary"
        onClick={() => {
          openModal();
          doFetchProductHitData();
        }}
        className="w-full"
      >
        {dict.b2b.productCard.makeAnOffer.openModal}
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
              closeModal={closeModal}
              openDetails={openDetails}
              vendorId={vendorId}
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
