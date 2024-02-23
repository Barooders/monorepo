'use client';

import { sendOpenNewConversation } from '@/analytics';
import Button from '@/components/atoms/Button';
import useUser from '@/hooks/state/useUser';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import { ProductSingleVariant } from '../../types';
const dict = getDictionary('fr');

const ConversationButton: React.FC<{
  productId: ProductSingleVariant['shopifyId'];
  className?: string;
}> = ({ productId, className }) => {
  const { hasuraToken } = useUser.getState();
  return (
    <Button
      className={`flex-grow text-sm uppercase ${className}`}
      intent="tertiary"
      onClick={() =>
        sendOpenNewConversation(productId, hasuraToken?.user.id ?? '')
      }
      href={`/pages/chat?product=${productId}`}
    >
      {dict.components.productCard.chatNow}
    </Button>
  );
};

export default ConversationButton;
