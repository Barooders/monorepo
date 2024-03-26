'use client';

import Input from '@/components/atoms/Input';
import { getDictionary } from '@/i18n/translate';
import Fuse from 'fuse.js';
import capitalize from 'lodash/capitalize';
import React, { useState } from 'react';
import SellingFormLine from '../_components/SellingFormLine';
import SellingFormPageContainer from '../_components/SellingFormPageContainer';
import useGetModelsForSelectedBrand from '../_hooks/useGetModelsForSelectedBrand';
import useSellForm from '../_state/useSellForm';

const dict = getDictionary('fr');

type PropsType = {
  onSelect: () => void;
  onGoBack: () => void;
};

const SelectModel: React.FC<PropsType> = ({ onSelect, onGoBack }) => {
  const { addProductInfo, addProductTagsInfo } = useSellForm();
  const availableModels = useGetModelsForSelectedBrand();
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const onSelectModel = (model: string) => {
    addProductInfo('model', model);
    addProductTagsInfo('modele', model);
    onSelect();
  };

  const index = new Fuse(availableModels);

  const displayedItems: string[] = searchTerm
    ? index
        .search(searchTerm)
        .map(({ item }) => item)
        .slice(0, 5)
    : availableModels;

  return (
    <SellingFormPageContainer
      onGoBack={onGoBack}
      title={dict.sellingForm.chooseModelTitle}
    >
      <div className="mx-auto my-3 flex w-80 items-center">
        <Input
          name="searchTerm"
          placeholder={`${availableModels.slice(0, 2).join(', ')}...`}
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
