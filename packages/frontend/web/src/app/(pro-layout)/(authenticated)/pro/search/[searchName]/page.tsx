import ProPage from '@/components/pages/ProPage';

const SavedSearchPage = ({ params }: { params: { searchName: string } }) => (
  <ProPage
    productInternalId={null}
    searchName={params.searchName}
  />
);

export default SavedSearchPage;
