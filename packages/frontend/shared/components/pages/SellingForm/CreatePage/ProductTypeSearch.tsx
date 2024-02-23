import useSellForm from '../_state/useSellForm';
import Fuse from 'fuse.js';
import { TaxonomyItem } from '../types';
import { useState } from 'react';
import { getDictionary } from '@/i18n/translate';
import SellingFormPageContainer from '../_components/SellingFormPageContainer';
import Input from '@/components/atoms/Input';
import SellingFormLine from '../_components/SellingFormLine';
import sortBy from 'lodash/sortBy';

const dict = getDictionary('fr');

type PropsType = {
  onSelect: () => void;
};

const ProductTypeSearch: React.FC<PropsType> = ({ onSelect }) => {
  const { sellFormConfig, setSelectedProductType, addProductInfo } =
    useSellForm();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  if (!sellFormConfig) return null;

  const onSelectItem = (id: string) => {
    const category = sellFormConfig?.taxonomy[id];
    if (!category) throw new Error(`Category ${id} not found in taxonomy`);
    if (!category.children || category.children.length > 0) {
      setSelectedCategoryId(id);
    } else {
      const productType = sellFormConfig?.productTypeConfig[category.name];
      if (!productType)
        throw new Error(
          `Could not find config for productType ${category.name}`,
        );
      addProductInfo('type', category.name);
      setSelectedProductType(category.name);
      onSelect();
    }
  };

  const selectedCategory = selectedCategoryId
    ? sellFormConfig?.taxonomy[selectedCategoryId]
    : null;

  const index = new Fuse(Object.values(sellFormConfig.taxonomy), {
    keys: ['name'],
  });

  const sortTaxonomies = (taxonomies: TaxonomyItem[]) =>
    sortBy(taxonomies, ['order', 'name']);

  const displayedItems: TaxonomyItem[] = selectedCategory
    ? sortTaxonomies(
        selectedCategory.children.map(
          (child) => sellFormConfig.taxonomy[child],
        ),
      )
    : searchTerm
    ? index
        .search(searchTerm)
        .map(({ item }) => item)
        .slice(0, 10)
    : sortTaxonomies(
        Object.values(sellFormConfig.taxonomy).filter(
          ({ rootItem }) => rootItem,
        ),
      );

  return (
    <SellingFormPageContainer
      onGoBack={
        selectedCategory ? () => setSelectedCategoryId(null) : undefined
      }
      title={selectedCategory?.name ?? dict.sellingForm.createMainTitle}
      subtitle={dict.sellingForm.chooseProductType}
    >
      <div className="mx-auto my-3 flex w-80 items-center">
        <Input
          name="searchTerm"
          placeholder={dict.sellingForm.productTypeSearchPlaceholder}
          inputAdditionalProps={{
            onChange: (e) => setSearchTerm(e.target.value),
          }}
        />
      </div>

      {displayedItems.map(({ id, name }) => (
        <SellingFormLine
          key={id}
          onClick={() => onSelectItem(id)}
        >
          <p>{name}</p>
        </SellingFormLine>
      ))}
    </SellingFormPageContainer>
  );
};

export default ProductTypeSearch;
