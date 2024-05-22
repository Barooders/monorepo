'use client';

import { sendClickProduct } from '@/analytics';
import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import { ProductSingleVariant } from '../../types';

const dict = getDictionary('fr');

const DetailsButton: React.FC<{
  handle: ProductSingleVariant['handle'];
  variant: ProductSingleVariant['variantShopifyId'];
  productId: ProductSingleVariant['id'];
  className?: string;
}> = ({ handle, variant, className, productId }) => {
  return (
    <Button
      className={`text-sm uppercase ${className}`}
      intent="tertiary"
      href={`/products/${handle}?variant=${variant}`}
      onClick={() => {
        sendClickProduct(productId);
      }}
    >
      {dict.components.productCard.seeDetails}
    </Button>
  );
};

export default DetailsButton;
