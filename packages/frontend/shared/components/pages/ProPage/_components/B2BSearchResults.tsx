import B2BProductCard from '@/components/molecules/ProductCard/b2b';
import { getDictionary } from '@/i18n/translate';
import { fromSearchToB2BProductCard } from '@/mappers/search';
import { Hits, useInstantSearch } from 'react-instantsearch-hooks-web';
import { SearchB2BVariantDocument } from 'shared-types';

const dict = getDictionary('fr');

const NoResultsBoundary: React.FC<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> = ({ children, fallback }) => {
  const { results } = useInstantSearch();

  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return <>{children}</>;
};

function NoResults() {
  return (
    <div className="mb-20 flex flex-col items-start gap-1">
      <p className="text-lg font-semibold text-slate-800">
        {dict.search.noResults.title}
      </p>
      <p className="text-sm text-slate-500">{dict.search.noResults.subtitle}</p>
    </div>
  );
}

const B2BSearchResults: React.FC = () => {
  return (
    <NoResultsBoundary fallback={<NoResults />}>
      <Hits
        classNames={{
          list: 'grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4',
        }}
        hitComponent={({ hit }: { hit: SearchB2BVariantDocument }) => {
          const productCardPropds = fromSearchToB2BProductCard(hit);
          return <B2BProductCard {...productCardPropds} />;
        }}
      />
    </NoResultsBoundary>
  );
};

export default B2BSearchResults;
