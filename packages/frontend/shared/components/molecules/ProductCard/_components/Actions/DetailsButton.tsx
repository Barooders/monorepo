'use client';

import { sendClickProduct } from '@/analytics';
import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import { ProductSingleVariant } from '../../types';

const dict = getDictionary('fr');

const DetailsButton: React.FC<{
  handle: ProductSingleVariant['handle'];
  productVariantInternalId: ProductSingleVariant['variantId'];
  productMerchantItemId: ProductSingleVariant['productMerchantItemId'];
  className?: string;
}> = ({
  handle,
  productVariantInternalId,
  className,
  productMerchantItemId,
}) => {
  return (
    <Button
      className={`text-sm uppercase ${className}`}
      intent="tertiary"
      href={`/products/${handle}?variant=${productVariantInternalId}`}
      onClick={() => {
        sendClickProduct({ productMerchantItemId });
      }}
    >
      {dict.components.productCard.seeDetails}
    </Button>
  );
};

export default DetailsButton;
