'use client';

import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import MakeB2BOfferModal from '../MakeB2BOfferModal';

const dict = getDictionary('fr');

type PropsType = {
  hasOpenedPriceOffer: boolean;
};

const B2BPriceOfferButton: React.FC<PropsType> = ({ hasOpenedPriceOffer }) => {
  const MakeOfferButton: React.FC<{
    openModal: () => void;
  }> = ({ openModal }) => {
    return (
      <Button
        intent="tertiary"
        onClick={openModal}
        className="mt-2"
      >
        {dict.b2b.productCard.makeAnOffer}
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

  return (
    <Modal
      ButtonComponent={
        hasOpenedPriceOffer ? ExistingOfferComponent : MakeOfferButton
      }
      ContentComponent={({ closeModal }) => (
        <MakeB2BOfferModal
          originalPrice={12}
          variantId={'variant'}
          productId={'productId'}
          closeModal={closeModal}
          negociationMaxAmountPercent={0}
          shouldRedirectToChat={false}
          buyerId={'buyerId'}
        />
      )}
    />
  );
};

export default B2BPriceOfferButton;
