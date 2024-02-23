import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { getDictionary } from '@/i18n/translate';
import { useState } from 'react';
import { FieldDefinitionType, InformationsType } from '../../../types';
import useSellForm from '../../../_state/useSellForm';

const dict = getDictionary('fr');

type PropsType = {
  title: string;
  data: FieldDefinitionType;
  onPress: () => void;
};

const SellFormInformationInput: React.FC<PropsType> = ({
  title,
  data,
  onPress,
}) => {
  const { informationsSelected, addProductTagsInfo } = useSellForm();
  const [value, setValue] = useState(
    informationsSelected?.[data.tagPrefix]?.toString(),
  );

  if (data.type !== InformationsType.INTEGER) return <></>;

  const onPressItem = () => {
    addProductTagsInfo(data.tagPrefix, value);
    onPress();
  };

  const disableValidation = () => {
    const parsedValue = parseInt(value, 10);
    if (
      data?.config.max &&
      parsedValue <= data?.config.max &&
      parsedValue >= (data?.config.min || 0)
    ) {
      return false;
    }

    return true;
  };

  return (
    <div className="flex flex-col gap-3">
      <div>
        <Input
          label={title}
          name={title}
          inputAdditionalProps={{
            value,
            onChange: (e) => setValue(e.target.value),
          }}
        />
        {!!data.config.max && (
          <p className="text-tertiary mt-1">
            Entre {data.config.min} et {data.config.max} {data.config.unit}
          </p>
        )}
      </div>

      <div className="w-full">
        <Button
          disabled={disableValidation()}
          onClick={onPressItem}
        >
          {dict.sellingForm.validate}
        </Button>
      </div>
    </div>
  );
};

export default SellFormInformationInput;
