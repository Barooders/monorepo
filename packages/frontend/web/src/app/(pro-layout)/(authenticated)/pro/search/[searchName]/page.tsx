import { SEARCH_BAR_QUERY_KEY } from '@/components/molecules/B2BSearchBar';
import ProPage from '@/components/pages/ProPage';
import useSearchParams from '@/hooks/useSearchParams';

const SavedSearchPage = ({ params }: { params: { searchName: string } }) => {
  const searchQuery = useSearchParams(SEARCH_BAR_QUERY_KEY);

  return (
    <ProPage
      productInternalId={null}
      searchName={params.searchName}
      searchQuery={searchQuery}
    />
  );
};

export default SavedSearchPage;
