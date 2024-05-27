import SortBy from '@/components/molecules/Filters/SortBy';
import { TrackedElements } from '@/config/e2e';
import { getDictionary } from '@/i18n/translate';
import { useInstantSearch } from 'react-instantsearch';

const dict = getDictionary('fr');

type PropsType = {
  searchQuery?: string;
};

const SearchHeader: React.FC<PropsType> = ({ searchQuery }) => {
  const { results } = useInstantSearch();

  const title =
    searchQuery !== undefined
      ? `${dict.search.resultsFor} "${searchQuery}"`
      : dict.search.allResults;

  return (
    <div className="mb-1 flex justify-between">
      <div className="flex items-end gap-2">
        <h1 className="text-xl font-semibold tracking-tight lg:text-3xl">
          {title}
        </h1>
        <span
          className="text-lg font-light text-gray-500"
          data-id={TrackedElements.HITS_COUNT}
        >
          ( {results.nbHits} )
        </span>
      </div>
      <div className="hidden lg:flex">
        <SortBy />
      </div>
    </div>
  );
};

export default SearchHeader;
