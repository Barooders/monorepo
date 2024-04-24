import { Condition } from '@/components/pages/SellingForm/types';
import { getDictionary } from '@/i18n/translate';
import capitalize from 'lodash/capitalize';
import React from 'react';
import { ProductMultiVariants } from '../types';

const dict = getDictionary('fr');

const Characteristics: React.FC<{
  tags: ProductMultiVariants['tags'];
  extraTagKeys?: { key: string; label?: string }[];
  className?: string;
  title: string;
  productType: string;
  variantCondition: Condition;
  componentSize?: 'large' | 'medium';
  direction?: 'inline' | 'col';
}> = ({
  tags,
  extraTagKeys = [],
  productType,
  variantCondition,
  title,
  className,
  componentSize = 'medium',
  direction = 'col',
}) => {
  const brand = tags.marque;

  const characteristics: { label?: string; value: string }[] = [];
  const model = tags.modele;
  characteristics.push({ value: model ?? title });

  const displayedTags = [
    { key: 'taille', label: dict.components.productCard.sizeLabel },
    { key: 'année' },
    ...extraTagKeys,
  ];

  displayedTags.forEach(({ key, label }) => {
    const tag = tags[key];
    if (tag) {
      characteristics.push({
        label,
        value: tag.length < 3 ? tag.toUpperCase() : tag,
      });
    }
  });

  const Wrapper = componentSize === 'large' ? 'h1' : 'div';

  return (
    <Wrapper
      className={`${className ?? ''} flex flex-col items-start ${
        direction === 'inline' ? 'md:flex-row md:items-center md:gap-3' : ''
      }`}
    >
      {componentSize === 'large' && direction !== 'inline' && (
        <p className="text-sm text-slate-500">{capitalize(productType)} </p>
      )}
      <p
        className={`${
          componentSize === 'large' ? 'text-2xl' : 'text-xs lg:text-lg'
        } font-semibold uppercase`}
      >
        {brand}{' '}
      </p>
      <p
        className={`flex gap-1 tracking-tight text-gray-600 ${
          componentSize === 'large' ? 'text-sm' : 'text-xs lg:text-sm'
        }`}
      >
        <span className="hidden">{' • '}</span>
        {characteristics.map((characteristic, index) => (
          <React.Fragment
            key={`${characteristic.label}:${characteristic.value}`}
          >
            {index !== 0 && ' • '}
            {characteristic.label && (
              <span className="hidden lg:inline">{characteristic.label} </span>
            )}
            <span
              className={`block ${
                componentSize === 'medium' ? 'max-w-[250px]' : ''
              } overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {characteristic.value}
            </span>
          </React.Fragment>
        ))}
        <span className={direction !== 'inline' ? 'hidden' : ''}>{' • '}</span>
      </p>
      <p
        className={`flex-shrink-0 text-gray-600 ${
          componentSize === 'large' ? 'text-sm' : 'text-xs lg:text-sm'
        }`}
      >
        {dict.components.productCard.getConditionLabel(variantCondition)}
      </p>
    </Wrapper>
  );
};

export default Characteristics;
