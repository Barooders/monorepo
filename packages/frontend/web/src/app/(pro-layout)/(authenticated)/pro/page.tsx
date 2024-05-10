'use client';

import ProPage, { PRODUCT_ID_QUERY_KEY } from '@/components/pages/ProPage';
import useSearchParams from '@/hooks/useSearchParams';
import { SEARCH_BAR_QUERY_KEY } from '../../../../../../shared/components/molecules/B2BSearchBar';

const WebProPage: React.FC = () => {
  const productInternalId = useSearchParams(PRODUCT_ID_QUERY_KEY);
  const searchQuery = useSearchParams(SEARCH_BAR_QUERY_KEY);

  return (
    <ProPage
      productInternalId={productInternalId}
      searchQuery={searchQuery}
    />
  );
};

export default WebProPage;
