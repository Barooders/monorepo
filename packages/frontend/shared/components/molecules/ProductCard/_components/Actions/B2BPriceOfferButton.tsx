'use client';

import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import MakeB2BOfferModal from '../MakeB2BOfferModal';

const dict = getDictionary('fr');

type PropsType = {
  productId: string;
  hasOpenedPriceOffer: boolean;
};

const B2BPriceOfferButton: React.FC<PropsType> = ({
  hasOpenedPriceOffer,
  productId,
}) => {
  const MakeOfferButton: React.FC<{
    openModal: () => void;
  }> = ({ openModal }) => {
    return (
      <Button
        intent="tertiary"
        onClick={openModal}
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

  return (
    <Modal
      ButtonComponent={
        hasOpenedPriceOffer ? ExistingOfferComponent : MakeOfferButton
      }
      ContentComponent={({ closeModal }) => (
        <MakeB2BOfferModal
          closeModal={closeModal}
          productId={productId}
          productName="BMC Alpenchallenge AL Four 2022"
          variants={[
            { title: 'Taille XL / Rouge / 2023', quantity: 2 },
            { title: 'Taille M / Bleu / 2023', quantity: 10 },
          ]}
          totalQuantity={12}
          largestBundlePriceInCents={12000}
          getBundleUnitPriceFromQuantity={(quantity) => quantity * 11000}
        />
      )}
    />
  );
};

export default B2BPriceOfferButton;
