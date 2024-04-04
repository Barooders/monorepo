import { FetchB2BSavedSearchQuery } from '@/__generated/graphql';
import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Collapse from '@/components/atoms/Collapse';
import PortalDrawer from '@/components/atoms/Drawer/portal';
import Input from '@/components/atoms/Input';
import Link from '@/components/atoms/Link';
import InfoModal from '@/components/atoms/Modal/InfoModal';
import {
  ProductAttributeConfig,
  productAttributesConfiguration,
} from '@/config/productAttributes';
import { useHasura } from '@/hooks/useHasura';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import { find, groupBy, map, mapValues, sortBy, sumBy } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect, useState } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import {
  useInstantSearch,
  useRefinementList,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import { HASURA_ROLES } from 'shared-types';
import ActiveFilters from './ActiveFilters';
import PriceRange from './PriceRange';
import SortBy from './SortBy';
import { getFacetLabel, getFacetValueLabel } from './utils/getFacetLabel';

const dict = getDictionary('fr');

const HIDDEN_FILTER_THRESHOLD = 0.5;
const REMOVED_FILTER_THRESHOLD = 0.2;

const FETCH_B2B_SAVED_SEARCH = gql`
  query FetchB2BSavedSearch {
    SavedSearch(
      limit: 1
      order_by: { createdAt: desc }
      where: { type: { _eq: "B2B_MAIN_PAGE" } }
    ) {
      FacetFilters {
        value
        facetName
      }
      NumericFilters {
        facetName
        operator
        value
      }
      query
    }
  }
`;

const FallbackComponent: React.FC<{ attribute: ProductAttributeConfig }> = ({
  attribute,
}) => {
  const { results } = useInstantSearch();
  const {
    items,
    refine,
    createURL,
    searchForItems,
    toggleShowMore,
    isShowingMore,
    canToggleShowMore,
    hasExhaustiveItems,
    isFromSearch,
  } = useRefinementList({
    attribute: attribute.attributeName,
    limit: 10,
    showMoreLimit: 100,
    showMore: true,
  });

  const facetObject = results.disjunctiveFacets.find(
    (facet) => facet.name === attribute.attributeName,
  );
  const facetValuesCount = facetObject
    ? Object.values(facetObject.data).reduce((a, b) => a + b, 0)
    : 0;
  const facetCoverage = facetValuesCount / results.nbHits;

  if (
    (!isFromSearch && (!items || items.length === 0)) ||
    facetCoverage < REMOVED_FILTER_THRESHOLD
  ) {
    return <></>;
  }

  const groupedItems = map(
    groupBy(items, (item) => item.label.toLowerCase()),
    (group) => {
      const firstItem = group[0];
      return {
        ...firstItem,
        count: sumBy(group, 'count'),
      };
    },
  );

  return (
    <Collapse
      defaultOpen={facetCoverage > HIDDEN_FILTER_THRESHOLD}
      renderTitle={() => (
        <div className="flex gap-2">
          <p>{getFacetLabel(attribute.attributeName)}</p>
          {attribute.informativeComponent && (
            <InfoModal contentComponent={attribute.informativeComponent} />
          )}
        </div>
      )}
      ContentComponent={() => (
        <div>
          {(canToggleShowMore || isFromSearch) && (
            <input
              className="mb-4 rounded border border-gray-300 px-1 py-1"
              placeholder={dict.search.filters.search}
              onChange={debounce((e) => searchForItems(e.target.value))}
            />
          )}
          <ul>
            {(attribute.sortAlphabetically === false
              ? groupedItems
              : sortBy(groupedItems, (item) =>
                  getFacetValueLabel(attribute.attributeName, item.label),
                )
            ).map((item) => (
              <li
                key={item.label}
                className="mb-2"
              >
                <Link
                  href={createURL(item.value)}
                  onClick={(event) => {
                    event.preventDefault();
                    refine(item.value);
                  }}
                >
                  <Checkbox
                    name={item.label}
                    checked={item.isRefined}
                    label={`${getFacetValueLabel(
                      attribute.attributeName,
                      item.label,
                    )} (${item.count})`}
                    onChange={(event) => {
                      event.preventDefault();
                    }}
                  />
                </Link>
              </li>
            ))}
            {!hasExhaustiveItems && <li>⋯</li>}
          </ul>
          {canToggleShowMore && (
            <button
              onClick={toggleShowMore}
              className="underline"
            >
              {isShowingMore
                ? dict.search.filters.showLess
                : dict.search.filters.showMore}
            </button>
          )}
        </div>
      )}
    />
  );
};

export const Filters = () => {
  return (
    <>
      <PriceRange attribute="price" />
      {Object.values(productAttributesConfiguration).map((attribute) => (
        <FallbackComponent
          key={attribute.name}
          attribute={attribute}
        />
      ))}
    </>
  );
};

export const B2BFilters = () => {
  const { refine } = useSearchBox({});
  const { setIndexUiState } = useInstantSearch();
  const [query, setQuery] = useState<string>('');

  const fetchB2BSavedSearch = useHasura<FetchB2BSavedSearchQuery>(
    FETCH_B2B_SAVED_SEARCH,
    HASURA_ROLES.REGISTERED_USER,
  );

  useEffect(() => {
    (async () => {
      const { SavedSearch } = await fetchB2BSavedSearch();

      if (SavedSearch.length === 0) return;

      const { query, FacetFilters, NumericFilters } = SavedSearch[0];

      setQuery(query ?? '');

      const facetFilters = groupBy(FacetFilters, 'facetName');
      const numericFilters = groupBy(NumericFilters, 'facetName');

      setIndexUiState((prevIndexUiState) => ({
        ...prevIndexUiState,
        refinementList: {
          ...prevIndexUiState.refinementList,
          ...mapValues(facetFilters, (value) =>
            value.map(({ value }) => value),
          ),
        },
        range: {
          ...prevIndexUiState.range,
          ...mapValues(numericFilters, (value) => {
            const minValue = find(value, { operator: '>=' })?.value ?? '';
            const maxValue = find(value, { operator: '<=' })?.value ?? '';
            return `${minValue}:${maxValue}`;
          }),
        },
        ...(query && { query }),
      }));
    })();
  }, []);

  return (
    <>
      <Input
        inputAdditionalProps={{
          onChange: (event) => refine(event.currentTarget.value),
          maxLength: 512,
          spellCheck: false,
          autoCapitalize: 'off',
          autoCorrect: 'off',
          autoComplete: 'off',
          defaultValue: query,
        }}
        name={'query_b2b'}
        placeholder={dict.search.filters.search}
        type={'search'}
        className="mb-5"
      />
      <PriceRange attribute="price" />
      <PriceRange
        attribute="total_quantity"
        showSlider={false}
      />
      {Object.values(productAttributesConfiguration)
        .filter(({ isB2BFilter }) => isB2BFilter)
        .map((attribute) => (
          <FallbackComponent
            key={attribute.name}
            attribute={attribute}
          />
        ))}
    </>
  );
};

export const DesktopFilters = () => (
  <div className="flex flex-col gap-3">
    <p className="hidden text-xl font-bold lg:flex">
      {dict.search.filtersTitle}
    </p>
    <ActiveFilters buttonSize="small" />
    <div>
      <Filters />
    </div>
  </div>
);

export const B2BDesktopFilters = () => (
  <div className="flex flex-col gap-3">
    <p className="hidden text-xl font-bold lg:flex">
      {dict.search.filtersTitle}
    </p>
    <ActiveFilters buttonSize="small" />
    <div>
      <B2BFilters />
    </div>
  </div>
);

export const MobileFilters = () => {
  return (
    <div className="flex overflow-x-auto">
      <PortalDrawer
        ContentComponent={MobileFilterDrawer}
        ButtonComponent={({ openMenu }) => (
          <Button
            onClick={openMenu}
            intent="tertiary"
            className="text-sm"
          >
            <div className="flex items-center gap-2">
              <HiOutlineAdjustmentsHorizontal />
              {dict.search.filtersTitle}
            </div>
          </Button>
        )}
      />
      <div className="ml-2 overflow-x-auto">
        <ActiveFilters buttonSize="medium" />
      </div>
    </div>
  );
};

export const MobileFilterDrawer: React.FC<{ closeMenu: () => void }> = ({
  closeMenu,
}) => {
  const { results } = useInstantSearch();

  return (
    <div className="relative h-[80vh] overflow-y-auto overscroll-contain px-2 pb-12">
      <p className="mb-3 text-sm text-slate-500">
        {results.nbHits} {dict.search.results}
      </p>
      <div className="flex items-center gap-3">
        <p className="font-semibold">{dict.search.sortBy.title}</p>
        <SortBy side="right" />
      </div>
      <hr className="my-3 border-b-gray-200" />
      <Filters />
      <Button
        className="fixed bottom-5 left-5 right-5 text-sm"
        onClick={closeMenu}
      >
        {dict.search.filters.validate}
      </Button>
    </div>
  );
};

export default Filters;
