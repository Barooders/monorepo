import Button from '@/components/atoms/Button';
import Checkbox from '@/components/atoms/Checkbox';
import Input from '@/components/atoms/Input';
import { getDictionary } from '@/i18n/translate';
import React, { useState } from 'react';
import useSellForm from '../../../_state/useSellForm';
import PriceIndicationText from './PriceIndicationText';

const dict = getDictionary('fr');
const conditionAndPriceLabels = dict.sellingForm.conditionAndPriceStep;

type PropsType = {
  onSelect: () => void;
};

const SellFormPriceSelection: React.FC<PropsType> = ({ onSelect }) => {
  const { addProductInfo, productInfos } = useSellForm();
  const [knowPrice, setKnowPrice] = useState<boolean>(true);
  const [price, setPrice] = useState<string>(
    productInfos.price?.toFixed() || '',
  );
  const [originalPrice, setOriginalPrice] = useState<string>(
    productInfos.compare_at_price?.toFixed() || '',
  );

  const onValidatePrice = () => {
    const parsedPrice = (amount: number | string) =>
      typeof amount !== 'string'
        ? amount
        : parseFloat(amount) % 1 === 0
          ? parseInt(amount, 10)
          : parseFloat(amount);

    addProductInfo('price', parsedPrice(price));

    if (parseInt(originalPrice, 10) > 0) {
      addProductInfo('compare_at_price', parsedPrice(originalPrice));
    }
    onSelect();
  };

  const handleDisabledButton = () => {
    if (!price || parseFloat(price) <= 0 || parseFloat(price) > 100000) {
      return true;
    }

    if (
      (!originalPrice ||
        parseFloat(originalPrice) <= 0 ||
        parseFloat(originalPrice) > 100000) &&
      knowPrice
    ) {
      return true;
    }

    if (parseInt(originalPrice, 10) < parseInt(price, 10)) {
      return true;
    }

    return false;
  };

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-lg font-semibold">
        {conditionAndPriceLabels.priceInputContent}
      </h1>
      <div className="flex flex-col gap-3">
        {knowPrice && (
          <Input
            type="number"
            name="original-price"
            label={conditionAndPriceLabels.newPriceLabel}
            placeholder="50€"
            inputAdditionalProps={{
              value: originalPrice.toString(),
              onChange: (e) => {
                return setOriginalPrice(e.target.value);
              },
            }}
          />
        )}
        <div
          onClick={() => {
            setOriginalPrice('');
            setKnowPrice(!knowPrice);
          }}
          className="mt-4 flex-row items-center"
        >
          <Checkbox
            name="knownPrice"
            label={conditionAndPriceLabels.unknownNewPrice}
            checked={!knowPrice}
          />
        </div>

        <Input
          name="selling-price"
          type="number"
          label={conditionAndPriceLabels.priceInputContent}
          placeholder="25€"
          inputAdditionalProps={{
            value: price.toString(),
            onChange: (e) => {
              return setPrice(e.target.value);
            },
          }}
        />
        <div className="mt-4">
          <PriceIndicationText
            price={price}
            originalPrice={originalPrice}
          />
        </div>
      </div>
      <Button
        disabled={handleDisabledButton()}
        onClick={onValidatePrice}
      >
        {dict.sellingForm.validate}
      </Button>
    </div>
  );
};

export default SellFormPriceSelection;
