'use client';

import { RegisteredUserTypes } from '@/__generated/hasura-role.config';
import { SUBSCRIBE_TO_OPENED_PRICE_OFFERS } from '@/clients/price-offer';
import Button, {
  PropsType as ButtonPropsType,
} from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import MakeOfferModal from '@/components/molecules/MakeOfferModal';
import useUser from '@/hooks/state/useUser';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { useSubscription } from '@apollo/client';
import first from 'lodash/first';
import React from 'react';
import { ProductSingleVariant } from '../../types';

const dict = getDictionary('fr');

type PropsType = {
  variant: ProductSingleVariant['variantShopifyId'];
  productInternalId: ProductSingleVariant['id'];
  price: ProductSingleVariant['price'];
  buyerInternalId?: string;
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
  const { productInternalId, className, size, buyerInternalId } = props;
  const { loading, data } =
    useSubscription<RegisteredUserTypes.SubscribeToOpenedPriceOfferSubscription>(
      SUBSCRIBE_TO_OPENED_PRICE_OFFERS,
      {
        variables: {
          productInternalId,
          buyerInternalId,
        },
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
    productInternalId,
    variant,
    price,
    buyerInternalId,
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
          productInternalId={productInternalId}
          closeModal={closeModal}
          negociationMaxAmountPercent={negociationMaxAmountPercent}
          shouldRedirectToChat={shouldRedirectToChat}
          buyerInternalId={buyerInternalId}
        />
      )}
    />
  );
};

export default PriceOfferButton;
