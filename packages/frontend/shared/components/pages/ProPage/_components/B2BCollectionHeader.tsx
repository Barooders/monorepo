import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

const B2BCollectionHeader: React.FC = () => {
  const { results } = useInstantSearch();

  return (
    <div className="mb-1 flex justify-between">
      <div className="flex items-end gap-2">
        <h1 className="text-xl font-semibold tracking-tight lg:text-3xl">
          {dict.b2b.proPage.title}{' '}
        </h1>
        <span
          className="text-lg font-light text-gray-500"
        >
          ( {results.nbHits} )
        </span>
      </div>
    </div>
  );
};

export default B2BCollectionHeader;
