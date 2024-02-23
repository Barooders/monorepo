'use client';

import Button, {
  PropsType as ButtonPropsType,
} from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { OpenedPriceOfferProductPageSubscription } from '@/__generated/graphql';
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

const PriceOffferButton: React.FC<{
  variant: ProductSingleVariant['variantShopifyId'];
  productId: ProductSingleVariant['id'];
  price: ProductSingleVariant['price'];
  buyerId?: string;
  negociationMaxAmountPercent: number;
  className?: string;
  size?: ButtonPropsType['size'];
  shouldRedirectToChat?: boolean;
}> = ({
  productId,
  variant,
  price,
  buyerId,
  negociationMaxAmountPercent,
  className,
  size,
  shouldRedirectToChat,
}) => {
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

    const { needsLogin } = useIsLoggedIn();

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

  return (
    <Modal
      ButtonComponent={ButtonComponent}
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
