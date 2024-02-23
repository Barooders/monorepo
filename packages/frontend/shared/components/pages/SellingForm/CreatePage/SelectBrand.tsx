'use client';

import React, { useState } from 'react';
import useSellForm from '../_state/useSellForm';
import Fuse from 'fuse.js';
import { BrandType } from '../types';
import SellingFormPageContainer from '../_components/SellingFormPageContainer';
import { getDictionary } from '@/i18n/translate';
import Input from '@/components/atoms/Input';
import SellingFormLine from '../_components/SellingFormLine';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';

const dict = getDictionary('fr');

type PropsType = {
  onSelect: () => void;
  onGoBack: () => void;
};

const SelectBrand: React.FC<PropsType> = ({ onSelect, onGoBack }) => {
  const {
    addProductInfo,
    addProductTagsInfo,
    getSelectedProductType,
    sellFormConfig,
  } = useSellForm();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const pimData = getSelectedProductType();

  const onSelectBrand = (brand: string) => {
    addProductInfo('brand', brand);
    addProductTagsInfo('marque', brand);
    onSelect();
  };

  if (!pimData?.brands)
    throw new Error(`No brands associated with productType ${pimData?.name}`);

  const index = new Fuse(sellFormConfig?.allBrands ?? [], {
    keys: ['name'],
  });

  const displayedItems: BrandType[] = searchTerm
    ? index
        .search(searchTerm)
        .map(({ item }) => item)
        .slice(0, 5)
    : pimData.brands;

  return (
    <SellingFormPageContainer
      onGoBack={onGoBack}
      title={dict.sellingForm.chooseBrandTitle}
    >
      <div className="mx-auto my-3 flex w-80 items-center">
        <Input
          name="searchTerm"
          placeholder={`${pimData?.brands
            .slice(0, 2)
            .map(({ name }) => name)
            .join(', ')}...`}
          inputAdditionalProps={{
            onChange: (e) => setSearchTerm(e.target.value),
          }}
        />
      </div>

      {searchTerm && (
        <SellingFormLine onClick={() => onSelectBrand(capitalize(searchTerm))}>
          {dict.sellingForm.addNewBrand(capitalize(searchTerm))}
        </SellingFormLine>
      )}

      {sortBy(displayedItems, 'name').map(({ name }) => (
        <SellingFormLine
          key={name}
          onClick={() => onSelectBrand(name)}
        >
          {name}
        </SellingFormLine>
      ))}
    </SellingFormPageContainer>
  );
};

export default SelectBrand;
