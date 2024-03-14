'use client';

import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import { ProductSingleVariant } from '../../types';
const dict = getDictionary('fr');

const ConversationButton: React.FC<{
  productId: ProductSingleVariant['shopifyId'];
  className?: string;
}> = ({ productId, className }) => {
  return (
    <Button
      className={`flex-grow text-sm uppercase ${className}`}
      intent="tertiary"
      href={`/pages/chat?product=${productId}`}
    >
      {dict.components.productCard.chatNow}
    </Button>
  );
};

export default ConversationButton;
