'use client';

import { Variant } from '../types';
import Select from '@/components/atoms/Select';

type PropsType = {
  variants: Variant[];
  selectedVariantId: string | null;
  onSelectVariant: (variantId: string) => void;
};

const VariantSelector: React.FC<PropsType> = ({
  variants,
  selectedVariantId,
  onSelectVariant,
}) => {
  return (
    <div className="w-full">
      <Select
        onSelect={onSelectVariant}
        wrapLabels={true}
        selectedOptionValue={selectedVariantId}
        options={variants.map((variant) => ({
          label: variant.name,
          value: variant.shopifyId,
        }))}
      />
    </div>
  );
};

export default VariantSelector;
