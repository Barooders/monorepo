import { FaCheck } from 'react-icons/fa6';
import { FieldDefinitionType, InformationsType } from '../../../types';
import SellingFormLine from '../../../_components/SellingFormLine';
import useSellForm from '../../../_state/useSellForm';

type PropsType = {
  data: FieldDefinitionType;
  onPress: () => void;
};

const SellFormInformationDetails: React.FC<PropsType> = ({ data, onPress }) => {
  const { addProductTagsInfo, informationsSelected } = useSellForm();

  const onPressItem = (value: string) => {
    addProductTagsInfo(data.tagPrefix, value);
    onPress();
  };

  if (
    data.type === InformationsType.BOOLEAN ||
    data.type === InformationsType.INTEGER
  )
    return <></>;

  const renderLabel = (item: string | { name: string; color: string }) => {
    if (data.type === InformationsType.COLOR) {
      const option = item as { name: string; color: string };
      return (
        <>
          <div
            className="h-3 w-3 border border-gray-200"
            style={{ backgroundColor: option.color }}
          />
          {option.name}
        </>
      );
    }

    const option = item as string;

    return option;
  };

  return (
    <>
      {data.config.options.map((option) => {
        const optionName = typeof option === 'string' ? option : option.name;
        return (
          <SellingFormLine
            key={optionName}
            onClick={() => onPressItem(optionName)}
          >
            <div className="flex items-center gap-1">
              <div className="w-4">
                {informationsSelected?.[data.tagPrefix] === option && (
                  <FaCheck className="text-xs" />
                )}
              </div>
              {renderLabel(option)}
            </div>
          </SellingFormLine>
        );
      })}
    </>
  );
};

export default SellFormInformationDetails;
