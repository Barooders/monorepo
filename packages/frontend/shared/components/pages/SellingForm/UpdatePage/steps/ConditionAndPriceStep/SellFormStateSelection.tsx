import Checkbox from '@/components/atoms/Checkbox';
import { getDictionary } from '@/i18n/translate';
import React, { useCallback } from 'react';
import { Condition } from '../../../types';
import useSellForm from '../../../_state/useSellForm';

const dict = getDictionary('fr');
const conditionAndPriceLabels = dict.sellingForm.conditionAndPriceStep;

type PropsType = {
  onSelect: () => void;
};

type StateItem = {
  key: Condition;
  title: string;
  description: string;
};

const stateItems: StateItem[] = [
  {
    key: Condition.AS_NEW,
    title: conditionAndPriceLabels.states.new.title,
    description: conditionAndPriceLabels.states.new.description,
  },
  {
    key: Condition.VERY_GOOD,
    title: conditionAndPriceLabels.states.veryGood.title,
    description: conditionAndPriceLabels.states.veryGood.description,
  },
  {
    key: Condition.GOOD,
    title: conditionAndPriceLabels.states.good.title,
    description: conditionAndPriceLabels.states.good.description,
  },
];

const SellFormStateSelection: React.FC<PropsType> = ({ onSelect }) => {
  const { addProductInfo, productInfos } = useSellForm();

  const onClickLineItem = (key: Condition) => {
    addProductInfo('condition', key);
    onSelect();
  };

  const renderItems = useCallback(
    ({ title, description, key }: StateItem, index: number) => {
      return (
        <div
          key={index}
          className="flex cursor-pointer flex-row items-center justify-between border-b border-[#E3E6E8] bg-white py-3 px-4 hover:bg-gray-50"
          onClick={() => onClickLineItem(key)}
        >
          <div className="flex-row items-center">
            <div className="w-[85%] flex-row items-center">
              <div>
                <p className="pr-5 text-base">{title}</p>
                <p className="text-tertiary mt-1 text-sm">{description}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex-row items-center justify-end">
            <Checkbox
              name={title}
              label=""
              checked={productInfos.condition === key}
            />
          </div>
        </div>
      );
    },
    [],
  );

  return (
    <>
      <h1 className="text-lg font-semibold">
        {conditionAndPriceLabels.stateInputContent}
      </h1>

      {stateItems.map(renderItems)}
    </>
  );
};

export default SellFormStateSelection;
