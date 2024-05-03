import Dropdown from '@/components/atoms/Dropdown';
import { searchCollections } from '@/config';
import { getDictionary } from '@/i18n/translate';
import { SalesChannelName } from '@/types';
import { useState } from 'react';
import { useSortBy } from 'react-instantsearch-hooks-web';

const dict = getDictionary('fr');

type PropsType = {
  side?: 'right' | 'left';
  salesChannel?: SalesChannelName;
};

const itemsBySalesChannel = {
  [SalesChannelName.PUBLIC]: [
    {
      label: dict.search.sortBy.options.relevance,
      value: searchCollections.products.main,
    },
    {
      label: dict.search.sortBy.options.priceAsc,
      value: searchCollections.products.priceAsc,
    },
    {
      label: dict.search.sortBy.options.priceDesc,
      value: searchCollections.products.priceDesc,
    },
    {
      label: dict.search.sortBy.options.dateDesc,
      value: searchCollections.products.dateDesc,
    },
    {
      label: dict.search.sortBy.options.discountDesc,
      value: searchCollections.products.discountDesc,
    },
  ],
  [SalesChannelName.B2B]: [
    {
      label: dict.search.sortBy.options.relevance,
      value: searchCollections.b2bProducts.main,
    },
    {
      label: dict.search.sortBy.options.discountDesc,
      value: searchCollections.b2bProducts.discountDesc,
    },
    {
      label: dict.search.sortBy.options.dateDesc,
      value: searchCollections.b2bProducts.dateDesc,
    },
    {
      label: dict.search.sortBy.options.bundleSize,
      value: searchCollections.b2bProducts.bundleSize,
    },
    {
      label: dict.search.sortBy.options.priceAsc,
      value: searchCollections.b2bProducts.priceAsc,
    },
    {
      label: dict.search.sortBy.options.priceDesc,
      value: searchCollections.b2bProducts.priceDesc,
    },
  ],
};

const SortBy: React.FC<PropsType> = ({
  side = 'left',
  salesChannel = SalesChannelName.PUBLIC,
}) => {
  const [sortBylabel, setSortByLabel] = useState(
    dict.search.sortBy.options.relevance,
  );
  const { refine: refineSorting, options } = useSortBy({
    items: itemsBySalesChannel[salesChannel],
  });

  const dropdownOptions = options.map((option) => ({
    label: option.label,
    name: option.value,
    onClick: () => {
      setSortByLabel(option.label);
      refineSorting(option.value);
    },
  }));
  return (
    <Dropdown
      className="shrink-0"
      options={dropdownOptions}
      title={sortBylabel}
      side={side}
    />
  );
};

export default SortBy;
