'use client';

import ProPage, { PRODUCT_ID_QUERY_KEY } from '@/components/pages/ProPage';
import useSearchParams from '@/hooks/useSearchParams';

const WebProPage: React.FC = () => {
  const productInternalId = useSearchParams(PRODUCT_ID_QUERY_KEY);

  return <ProPage productInternalId={productInternalId} />;
};

export default WebProPage;
