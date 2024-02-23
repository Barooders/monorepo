import Dropdown from '@/components/atoms/Dropdown';
import { searchIndexes } from '@/config';
import { getDictionary } from '@/i18n/translate';
import { useState } from 'react';
import { useSortBy } from 'react-instantsearch-hooks-web';

const dict = getDictionary('fr');

type PropsType = {
  side?: 'right' | 'left';
};

const SortBy: React.FC<PropsType> = ({ side = 'left' }) => {
  const [sortBylabel, setSortByLabel] = useState(
    dict.search.sortBy.options.relevance,
  );
  const { refine: refineSorting, options } = useSortBy({
    items: [
      {
        label: dict.search.sortBy.options.relevance,
        value: searchIndexes.products.main,
      },
      {
        label: dict.search.sortBy.options.priceAsc,
        value: searchIndexes.products.priceAsc,
      },
      {
        label: dict.search.sortBy.options.priceDesc,
        value: searchIndexes.products.priceDesc,
      },
      {
        label: dict.search.sortBy.options.dateDesc,
        value: searchIndexes.products.dateDesc,
      },
      {
        label: dict.search.sortBy.options.discountDesc,
        value: searchIndexes.products.discountDesc,
      },
    ],
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
