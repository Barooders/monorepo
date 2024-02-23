'use client';

import React, { useState } from 'react';
import useSellForm from '../_state/useSellForm';
import Fuse from 'fuse.js';
import SellingFormPageContainer from '../_components/SellingFormPageContainer';
import { getDictionary } from '@/i18n/translate';
import Input from '@/components/atoms/Input';
import SellingFormLine from '../_components/SellingFormLine';
import capitalize from 'lodash/capitalize';

const dict = getDictionary('fr');

type PropsType = {
  onSelect: () => void;
  onGoBack: () => void;
};

const SelectModel: React.FC<PropsType> = ({ onSelect, onGoBack }) => {
  const { addProductInfo, addProductTagsInfo, getSelectedBrand } =
    useSellForm();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const selectedBrand = getSelectedBrand();

  const onSelectModel = (model: string) => {
    addProductInfo('model', model);
    addProductTagsInfo('modele', model);
    onSelect();
  };

  const index = new Fuse(selectedBrand?.models ?? []);

  const displayedItems: string[] = searchTerm
    ? index
        .search(searchTerm)
        .map(({ item }) => item)
        .slice(0, 5)
    : selectedBrand?.models ?? [];

  return (
    <SellingFormPageContainer
      onGoBack={onGoBack}
      title={dict.sellingForm.chooseModelTitle}
    >
      <div className="mx-auto my-3 flex w-80 items-center">
        <Input
          name="searchTerm"
          placeholder={`${selectedBrand?.models.slice(0, 2).join(', ')}...`}
          inputAdditionalProps={{
            onChange: (e) => setSearchTerm(e.target.value),
          }}
        />
      </div>

      {searchTerm && (
        <SellingFormLine onClick={() => onSelectModel(capitalize(searchTerm))}>
          {dict.sellingForm.addNewModel(capitalize(searchTerm))}
        </SellingFormLine>
      )}

      {displayedItems.sort().map((item) => (
        <SellingFormLine
          key={item}
          onClick={() => onSelectModel(item)}
        >
          {item}
        </SellingFormLine>
      ))}

      <SellingFormLine onClick={() => onSelectModel('')}>
        {dict.sellingForm.unknownModel}
      </SellingFormLine>
    </SellingFormPageContainer>
  );
};

export default SelectModel;
