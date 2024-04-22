'use client';

import ProPage from '@/components/pages/ProPage';
import useSearchParams from '@/hooks/useSearchParams';

const WebProPage: React.FC = () => {
  const productInternalId = useSearchParams('product');

  return <ProPage productInternalId={productInternalId} />;
};

export default WebProPage;
