'use client';

import { getDictionary } from '@/i18n/translate';
import useSellForm from '../../_state/useSellForm';

const dict = getDictionary('fr');
const descriptionLabels = dict.sellingForm.descriptionStep;

const DescriptionStep: React.FC = () => {
  const { addProductInfo, productInfos } = useSellForm();

  const descriptionLengthCounter = () => (
    <p className="text-tertiary justify-end text-sm">{`${
      productInfos.body_html?.length || 0
    }/2000`}</p>
  );

  return (
    <div className="flex flex-col gap-5 p-5">
      <div className="flex flex-col gap-1">
        {descriptionLabels.describeArticle}
        <textarea
          className="w-full rounded border border-gray-300 p-2"
          placeholder={descriptionLabels.placeholder}
          value={productInfos.body_html ?? ''}
          autoFocus
          onChange={(e) => {
            addProductInfo('body_html', e.target.value);
          }}
        />
        <p className="text-tertiary mt-1">
          {descriptionLabels.minimumCharacters}
        </p>
        {descriptionLengthCounter()}
      </div>
    </div>
  );
};

export default DescriptionStep;
