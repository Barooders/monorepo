'use client';

import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Collapse from '@/components/atoms/Collapse';
import PortalDrawer from '@/components/atoms/Drawer/withButton';
import Link from '@/components/atoms/Link';
import InfoModal from '@/components/atoms/Modal/InfoModal';
import {
  ProductAttributeConfig,
  b2bProductAttributesConfiguration,
  publicProductAttributesConfiguration,
} from '@/config/productAttributes';
import { getDictionary } from '@/i18n/translate';
import { find, groupBy, map, mapValues, sortBy, sumBy } from 'lodash';
import debounce from 'lodash/debounce';
import { useEffect } from 'react';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';
import { useInstantSearch, useRefinementList } from 'react-instantsearch';
import B2BSaveFiltersButton from '../B2BSaveFiltersButton';
import useB2BSearchContext from '../B2BSearchBar/_state/useB2BSearchContext';
import ActiveFilters from './ActiveFilters';
import RangeFilter from './RangeFilter';
import SortBy from './SortBy';
import { getFacetLabel, getFacetValueLabel } from './utils/getFacetLabel';

const dict = getDictionary('fr');

const HIDDEN_FILTER_THRESHOLD = 0.5;
const REMOVED_FILTER_THRESHOLD = 0.2;

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
  const facetValuesCount =
    facetObject !== undefined
      ? Object.values(facetObject.data).reduce((a, b) => a + b, 0)
      : 0;
  const facetCoverage = facetValuesCount / results.nbHits;

  if (
    (!Boolean(isFromSearch) && items.length === 0) ||
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
          {attribute.informativeComponent !== undefined && (
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
              onChange={debounce((e) => searchForItems(e.target.value), 300)}
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
      <RangeFilter attribute="price" />
      {Object.values(publicProductAttributesConfiguration).map((attribute) => (
        <FallbackComponent
          key={attribute.name}
          attribute={attribute}
        />
      ))}
    </>
  );
};

export const B2BFilters = () => {
  const { setIndexUiState } = useInstantSearch();

  const { b2BSearchBar, savedSearch, setB2BSearchBar } = useB2BSearchContext();

  useEffect(() => {
    if (!savedSearch) return;

    const { query: savedQuery, FacetFilters, NumericFilters } = savedSearch;

    const query =
      savedQuery !== null && b2BSearchBar === undefined
        ? savedQuery
        : b2BSearchBar;

    const facetFilters = groupBy(FacetFilters, 'facetName');
    const numericFilters = groupBy(NumericFilters, 'facetName');

    setIndexUiState((prevIndexUiState) => ({
      ...prevIndexUiState,
      refinementList: {
        ...prevIndexUiState.refinementList,
        ...mapValues(facetFilters, (value) => value.map(({ value }) => value)),
      },
      range: {
        ...prevIndexUiState.range,
        ...mapValues(numericFilters, (value) => {
          const minValue = find(value, { operator: '>=' })?.value ?? '';
          const maxValue = find(value, { operator: '<=' })?.value ?? '';
          return `${minValue}:${maxValue}`;
        }),
      },
      query: query === '' ? undefined : query,
    }));

    if (savedQuery !== null && b2BSearchBar === undefined) {
      setB2BSearchBar(savedQuery);
      return;
    }
  }, [savedSearch, setIndexUiState]);

  useEffect(() => {
    if (b2BSearchBar === undefined) return;

    setIndexUiState((prevIndexUiState) => ({
      ...prevIndexUiState,
      query: b2BSearchBar === '' ? undefined : b2BSearchBar,
    }));
  }, [b2BSearchBar, setIndexUiState]);

  return (
    <>
      <RangeFilter attribute="price" />
      {Object.values(b2bProductAttributesConfiguration).map((attribute) => (
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
  <div className="flex flex-col items-start gap-3">
    <p className="hidden text-xl font-bold lg:flex">
      {dict.search.filtersTitle}
    </p>
    <B2BSaveFiltersButton />
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

export const B2BMobileFilters = () => {
  return (
    <div className="flex overflow-x-auto">
      <PortalDrawer
        ContentComponent={B2BMobileFilterDrawer}
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

export const B2BMobileFilterDrawer: React.FC<{ closeMenu: () => void }> = ({
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
      <B2BSaveFiltersButton />
      <B2BFilters />
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
