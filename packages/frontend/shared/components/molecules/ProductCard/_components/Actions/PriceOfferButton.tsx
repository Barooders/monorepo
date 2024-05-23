'use client';

import Button, {
  PropsType as ButtonPropsType,
} from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import MakeOfferModal from '@/components/molecules/MakeOfferModal';
import useUser from '@/hooks/state/useUser';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import { ProductSingleVariant } from '../../types';

const dict = getDictionary('fr');

type PropsType = {
  variantInternalId?: ProductSingleVariant['variantId'];
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
  const { productInternalId, className, size } = props;

  return productInternalId ? (
    <Button
      className={`text-sm ${className}`}
      intent="tertiary"
      href={`/pages/chat?product=${productInternalId}`}
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
    variantInternalId,
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
          variantInternalId={variantInternalId}
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
