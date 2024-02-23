'use client';

import useSellForm from '../../../_state/useSellForm';
import { FieldDefinitionType, InformationsType } from '../../../types';
import Modal from '@/components/atoms/Modal';
import SellFormInformationInput from './SellFormInformationInput';
import SellFormInformationDetails from './SellFormInformationDetails';
import SellingFormLine from '../../../_components/SellingFormLine';
import { FaAsterisk } from 'react-icons/fa6';
import capitalize from 'lodash/capitalize';
import YesNoSelector from '@/components/atoms/YesNoSelector';

const InformationLine = ({
  isRequired,
  children,
  onClick,
}: {
  isRequired: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <SellingFormLine onClick={onClick}>
      <div className="flex w-full items-center gap-1">
        <div className="w-4">
          {isRequired && <FaAsterisk className="text-xs" />}
        </div>
        {children}
      </div>
    </SellingFormLine>
  );
};

const InformationStep: React.FC = () => {
  const { addProductTagsInfo, informationsSelected, getInformationsConfig } =
    useSellForm();

  const renderItem = (item: FieldDefinitionType) => {
    if (item?.type === InformationsType.BOOLEAN) {
      return (
        <InformationLine isRequired={item.required}>
          <YesNoSelector
            value={
              informationsSelected?.[item.tagPrefix] === 'oui'
                ? true
                : informationsSelected?.[item.tagPrefix] === 'non'
                ? false
                : null
            }
            onChange={(value) =>
              addProductTagsInfo(item.tagPrefix, value ? 'oui' : 'non')
            }
            label={item.label}
          />
        </InformationLine>
      );
    }

    return (
      <Modal
        ButtonComponent={({ openModal }) => (
          <InformationLine
            onClick={openModal}
            isRequired={item.required}
          >
            <div className="flex w-full items-center justify-between">
              <p>{capitalize(item.label)}</p>
              <p className="text-sm text-gray-400">
                {informationsSelected && informationsSelected?.[item.tagPrefix]}
              </p>
            </div>
          </InformationLine>
        )}
        ContentComponent={({ closeModal }) => {
          if (item.type === InformationsType.INTEGER) {
            return (
              <SellFormInformationInput
                title={item.label}
                data={item}
                onPress={closeModal}
              />
            );
          }

          if (
            item.type === InformationsType.COLOR ||
            item.type === InformationsType.SELECT
          ) {
            return (
              <SellFormInformationDetails
                data={item}
                onPress={closeModal}
              />
            );
          }

          return <></>;
        }}
      />
    );
  };

  const dataSortByRequired = () =>
    getInformationsConfig().sort(
      (
        a: { required: boolean },
        b: { required: boolean; tagPrefix: string },
      ) => {
        if (a.required && !b.required) {
          return -1;
        } else if (!a.required && b.required) {
          return 1;
        }
        return 0;
      },
    );

  return (
    <>
      <div className="flex flex-col">
        {dataSortByRequired().map((item) => (
          <div key={item.name}>{renderItem(item)}</div>
        ))}
      </div>
    </>
  );
};

export default InformationStep;
