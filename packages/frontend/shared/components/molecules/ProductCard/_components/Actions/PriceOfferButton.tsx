'use client';

import { OpenedPriceOfferProductPageSubscription } from '@/__generated/graphql';
import Button, {
  PropsType as ButtonPropsType,
} from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import MakeOfferModal from '@/components/molecules/MakeOfferModal';
import useUser from '@/hooks/state/useUser';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { useTraceUpdate } from '@/utils/useTraceUpdate';
import { gql, useSubscription } from '@apollo/client';
import { first } from 'lodash';
import React from 'react';
import { ProductSingleVariant } from '../../types';

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

const MakeOfferButton: React.FC<
  PropsType & {
    openModal: () => void;
  }
> = ({ openModal, className, size }) => {
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

const ButtonComponent: React.FC<PropsType & { openModal: () => void }> = (
  props,
) => {
  useTraceUpdate(props);
  const { productId, className, size } = props;
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
    <MakeOfferButton {...props} />
  );
};

const PriceOfferButton: React.FC<PropsType> = (props) => {
  const {
    productId,
    variant,
    price,
    buyerId,
    negociationMaxAmountPercent,
    shouldRedirectToChat,
  } = props;
  const { hasuraToken } = useUser();

  return (
    <Modal
      ButtonComponent={
        hasuraToken
          ? ({ openModal }) => (
              <ButtonComponent
                openModal={openModal}
                {...props}
              />
            )
          : ({ openModal }) => (
              <MakeOfferButton
                openModal={openModal}
                {...props}
              />
            )
      }
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

export default PriceOfferButton;
