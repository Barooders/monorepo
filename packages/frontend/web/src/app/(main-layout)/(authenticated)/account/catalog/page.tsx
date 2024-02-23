'use client';

import Catalog, { TAB_SLUGS } from '@/components/pages/Account/Catalog';
import useSearchParams from '@/hooks/useSearchParams';

const CatalogPage = () => {
  const tabParam = useSearchParams('tab') as TAB_SLUGS;

  return <Catalog initialTab={tabParam} />;
};

export default CatalogPage;
