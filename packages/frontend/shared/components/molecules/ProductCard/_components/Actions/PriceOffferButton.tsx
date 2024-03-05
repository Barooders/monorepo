'use client';

import { OpenedPriceOfferProductPageSubscription } from '@/__generated/graphql';
import Button, {
  PropsType as ButtonPropsType,
} from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import useUser from '@/hooks/state/useUser';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { gql, useSubscription } from '@apollo/client';
import { first } from 'lodash';
import React from 'react';
import { ProductSingleVariant } from '../../types';
import MakeOfferModal from '../MakeOfferModal';

const dict = getDictionary('fr');

const OPENED_PRICE_OFFERS_PRODUCT_PAGE = gql`
  subscription openedPriceOfferProductPage($productId: String!) {
    PriceOffer(
      where: {
        _and: {
          productId: { _eq: $productId }
          _or: [
            { status: { _eq: "PROPOSED" } }
            { status: { _eq: "ACCEPTED" } }
          ]
        }
      }
    ) {
      id
      product {
        shopifyId
      }
    }
  }
`;

type PropsType = {
  variant: ProductSingleVariant['variantShopifyId'];
  productId: ProductSingleVariant['id'];
  price: ProductSingleVariant['price'];
  buyerId?: string;
  negociationMaxAmountPercent: number;
  className?: string;
  size?: ButtonPropsType['size'];
  shouldRedirectToChat?: boolean;
};

const PriceOffferButton: React.FC<PropsType> = ({
  productId,
  variant,
  price,
  buyerId,
  negociationMaxAmountPercent,
  className,
  size,
  shouldRedirectToChat,
}) => {
  const MakeOfferButton: React.FC<{
    openModal: () => void;
  }> = ({ openModal }) => {
    const { needsLogin } = useIsLoggedIn();

    return (
      <Button
        className={`text-sm ${className}`}
        intent="tertiary"
        onClick={needsLogin(openModal)}
        size={size}
      >
        {dict.makeOffer.openModal}
      </Button>
    );
  };

  const ButtonComponent: React.FC<{ openModal: () => void }> = ({
    openModal,
  }) => {
    const { loading, data } =
      useSubscription<OpenedPriceOfferProductPageSubscription>(
        OPENED_PRICE_OFFERS_PRODUCT_PAGE,
        {
          variables: { productId },
        },
      );

    const productShopifyId = first(data?.PriceOffer)?.product.shopifyId;

    return loading ? (
      <div className="flex items-start justify-center">
        <Loader />
      </div>
    ) : productShopifyId ? (
      <Button
        className={`text-sm ${className}`}
        intent="tertiary"
        href={`/pages/chat?product=${productShopifyId}`}
        size={size}
      >
        {dict.makeOffer.seePriceOffer}
      </Button>
    ) : (
      <MakeOfferButton openModal={openModal} />
    );
  };

  const { hasuraToken } = useUser();

  return (
    <Modal
      ButtonComponent={hasuraToken ? ButtonComponent : MakeOfferButton}
      ContentComponent={({ closeModal }) => (
        <MakeOfferModal
          originalPrice={price}
          variantId={variant}
          productId={productId}
          closeModal={closeModal}
          negociationMaxAmountPercent={negociationMaxAmountPercent}
          shouldRedirectToChat={shouldRedirectToChat}
          buyerId={buyerId}
        />
      )}
    />
  );
};

export default PriceOffferButton;
