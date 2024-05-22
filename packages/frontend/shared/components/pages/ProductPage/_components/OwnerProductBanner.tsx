'use client';

import ActionsBanner from '@/components/atoms/ActionsBanner';
import Button from '@/components/atoms/Button';
import useUser from '@/hooks/state/useUser';
import { getDictionary } from '@/i18n/translate';
import { ProductCardProps } from '..';

const dict = getDictionary('fr');

const OwnerProductBanner = ({
  vendor: { id: productVendorId },
  shopifyId: productShopifyId,
}: ProductCardProps) => {
  const { hasuraToken } = useUser();

  if (!productVendorId || hasuraToken?.user.id !== productVendorId)
    return <></>;

  return (
    <ActionsBanner title={dict.productPage.ownerBanner.title}>
      <Button href={`/selling-form/${productShopifyId}`}>
        {dict.productPage.ownerBanner.editProduct}
      </Button>
      <span className="text-sm font-semibold italic">
        {dict.productPage.ownerBanner.warning}
      </span>
    </ActionsBanner>
  );
};

export default OwnerProductBanner;
