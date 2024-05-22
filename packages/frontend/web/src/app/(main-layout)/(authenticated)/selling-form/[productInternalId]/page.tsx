'use client';

import UpdatePage from '@/components/pages/SellingForm/UpdatePage';

const SellForm = ({ params }: { params: { productInternalId: string } }) => {
  const { productInternalId } = params;

  return <UpdatePage productInternalId={productInternalId} />;
};

export default SellForm;
