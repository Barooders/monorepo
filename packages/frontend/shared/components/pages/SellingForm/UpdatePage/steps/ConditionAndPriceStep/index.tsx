'use client';

import Modal from '@/components/atoms/Modal';
import { getDictionary } from '@/i18n/translate';
import SellingFormLine from '../../../_components/SellingFormLine';
import useSellForm from '../../../_state/useSellForm';
import SellFormPriceSelection from './SellFormPriceSelection';
import SellFormStateSelection from './SellFormStateSelection';

const dict = getDictionary('fr');
const conditionAndPriceLabels = dict.sellingForm.conditionAndPriceStep;

const ConditionAndPriceStep: React.FC = () => {
  const { productInfos } = useSellForm();

  return (
    <div className="flex flex-col">
      <Modal
        ButtonComponent={({ openModal }) => (
          <SellingFormLine onClick={openModal}>
            <div className="flex w-full items-center justify-between">
              <p>{conditionAndPriceLabels.stateInputContent}</p>
              <p className="text-sm text-gray-500">
                {productInfos.condition ?? undefined}
              </p>
            </div>
          </SellingFormLine>
        )}
        ContentComponent={({ closeModal }) => (
          <SellFormStateSelection onSelect={closeModal} />
        )}
      />
      <Modal
        ButtonComponent={({ openModal }) => (
          <SellingFormLine onClick={openModal}>
            <div className="flex w-full items-center justify-between">
              <p>{conditionAndPriceLabels.priceInputContent}</p>
              <p className="text-sm text-gray-500">
                {productInfos?.price !== null
                  ? `${productInfos.price} €`
                  : undefined}
              </p>
            </div>
          </SellingFormLine>
        )}
        ContentComponent={({ closeModal }) => (
          <SellFormPriceSelection onSelect={closeModal} />
        )}
      />
    </div>
  );
};

export default ConditionAndPriceStep;
