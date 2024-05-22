'use client';

import Select from '@/components/atoms/Select';
import { Variant } from '../types';

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
          value: variant.id,
        }))}
      />
    </div>
  );
};

export default VariantSelector;
