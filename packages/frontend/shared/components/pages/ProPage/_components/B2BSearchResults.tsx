import { FetchB2BGlobalCommissionQuery } from '@/__generated/graphql';
import B2BProductCard from '@/components/molecules/ProductCard/b2b';
import { HASURA_ROLES } from '@/config';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { fromSearchToB2BProductCard } from '@/mappers/search';
import { gql } from '@apollo/client';
import { head } from 'lodash';
import { useEffect } from 'react';
import { Hits, useInstantSearch } from 'react-instantsearch-hooks-web';
import { SearchB2BVariantDocument } from 'shared-types';
import AdminHitHelper from './AdminHitHelper';

const dict = getDictionary('fr');

const FETCH_B2B_GLOBAL_COMMISSION = gql`
  query fetchB2BGlobalCommission {
    CommissionRule(where: { type: { _eq: "GLOBAL_B2B_BUYER_COMMISSION" } }) {
      rules
    }
  }
`;

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
  const fetchB2BGlobalCommission = useHasura<FetchB2BGlobalCommissionQuery>(
    FETCH_B2B_GLOBAL_COMMISSION,
    HASURA_ROLES.B2B_USER,
  );
  const [b2bGlobalCommission, doFetchB2BGlobalCommission] = useWrappedAsyncFn(
    fetchB2BGlobalCommission,
  );

  useEffect(() => {
    doFetchB2BGlobalCommission();
  }, [doFetchB2BGlobalCommission]);

  const b2bGlobalCommissionValue = b2bGlobalCommission.value;

  if (!b2bGlobalCommissionValue) return <NoResults />;

  return (
    <NoResultsBoundary fallback={<NoResults />}>
      <Hits
        classNames={{
          list: 'grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4',
        }}
        hitComponent={({ hit }: { hit: SearchB2BVariantDocument }) => {
          const productCardProps = fromSearchToB2BProductCard(
            hit,
            head(b2bGlobalCommissionValue.CommissionRule)?.rules,
          );
          return (
            <>
              <AdminHitHelper hit={hit} />
              <B2BProductCard {...productCardProps} />
            </>
          );
        }}
      />
    </NoResultsBoundary>
  );
};

export default B2BSearchResults;
