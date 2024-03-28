import { B2BGuarantees } from '@/components/molecules/ProductCard/_components/Guarantees';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import { getDictionary } from '@/i18n/translate';
import { useInstantSearch } from 'react-instantsearch-hooks-web';

const dict = getDictionary('fr');

const B2BCollectionHeader: React.FC = () => {
  const { results } = useInstantSearch();
  const { extractTokenInfo } = useHasuraToken();
  const { sellerName } = extractTokenInfo();

  return (
    <div className="mb-1 flex flex-col justify-between">
      <div className="flex flex-col gap-2">
        <div className="mb-2 rounded-lg border border-slate-200 bg-slate-100 p-4">
          Bienvenue <strong>{sellerName}</strong>, voici votre sélection
          personnalisée 🚴
        </div>
      </div>
      <B2BGuarantees />
      <div className="mt-5 flex items-end gap-2">
        <h1 className="text-xl font-semibold tracking-tight lg:text-3xl">
          {dict.b2b.proPage.title}
        </h1>
        <span className="text-lg font-light text-gray-500">
          ( {results.nbHits} )
        </span>
      </div>
    </div>
  );
};

export default B2BCollectionHeader;
