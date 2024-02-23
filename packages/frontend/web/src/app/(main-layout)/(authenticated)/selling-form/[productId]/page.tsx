'use client';

import UpdatePage from '@/components/pages/SellingForm/UpdatePage';
import useSearchParams from '@/hooks/useSearchParams';

const SellForm = ({ params }: { params: { productId: string } }) => {
  const { productId } = params;
  const variantId = useSearchParams('variantId') ?? undefined;

  return (
    <UpdatePage
      productId={productId}
      variantId={variantId}
    />
  );
};

export default SellForm;
