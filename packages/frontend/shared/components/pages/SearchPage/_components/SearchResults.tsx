import NoSSR from '@/components/atoms/NoSSR';
import ProductCard from '@/components/molecules/ProductCard';
import SavedSearchButton from '@/components/molecules/SavedSearchButton/index.desktop';
import { getDictionary } from '@/i18n/translate';
import { fromSearchToProductCard } from '@/mappers/search';
import { Hits, useInstantSearch } from 'react-instantsearch-hooks-web';
import { SearchPublicVariantDocument } from 'shared-types';
import AdminHitHelper from './AdminHitHelper';

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
      <div className="mt-3">
        <SavedSearchButton />
      </div>
    </div>
  );
}

const SearchResults: React.FC = () => {
  return (
    <NoResultsBoundary fallback={<NoResults />}>
      <Hits
        classNames={{
          list: 'grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4',
        }}
        hitComponent={({ hit }: { hit: SearchPublicVariantDocument }) => {
          const productCardProps = fromSearchToProductCard(hit);

          return (
            <>
              <NoSSR>
                <AdminHitHelper hit={hit} />
              </NoSSR>
              <ProductCard
                key={hit.product_internal_id}
                intent="card"
                className="w-full"
                {...productCardProps}
              />
            </>
          );
        }}
      />
      <div className="sticky bottom-10 left-0 right-0 mt-5 hidden justify-center md:flex">
        <SavedSearchButton />
      </div>
    </NoResultsBoundary>
  );
};

export default SearchResults;
