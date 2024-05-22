'use client';

import { sendClickProduct } from '@/analytics';
import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import React from 'react';
import { ProductSingleVariant } from '../../types';

const dict = getDictionary('fr');

const DetailsButton: React.FC<{
  handle: ProductSingleVariant['handle'];
  variantInternalId: ProductSingleVariant['variantId'];
  productShopifyId: ProductSingleVariant['shopifyId'];
  className?: string;
}> = ({ handle, variantInternalId, className, productShopifyId }) => {
  return (
    <Button
      className={`text-sm uppercase ${className}`}
      intent="tertiary"
      href={`/products/${handle}?variant=${variantInternalId}`}
      onClick={() => {
        sendClickProduct(productShopifyId);
      }}
    >
      {dict.components.productCard.seeDetails}
    </Button>
  );
};

export default DetailsButton;
