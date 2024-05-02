import Link from '@/components/atoms/Link';
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
  openDetails?: () => void;
}> = ({
  tags,
  extraTagKeys = [],
  productType,
  variantCondition,
  title,
  className,
  componentSize = 'medium',
  direction = 'col',
  openDetails,
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
        <p className="text-sm text-zinc-500">{capitalize(productType)} </p>
      )}
      <p
        className={`${
          componentSize === 'large' ? 'text-2xl' : 'text-sm lg:text-lg'
        } font-bold uppercase text-zinc-900`}
      >
        {brand}{' '}
      </p>
      <p
        className={`flex flex-wrap gap-1 overflow-hidden font-medium tracking-tight text-zinc-400 ${
          componentSize === 'large'
            ? 'h-5 text-sm'
            : 'h-4 text-xs lg:h-5 lg:text-sm'
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
                componentSize === 'medium' ? 'max-w-[200px]' : ''
              } overflow-hidden text-ellipsis whitespace-nowrap`}
            >
              {characteristic.value}
            </span>
          </React.Fragment>
        ))}
        <span className={direction !== 'inline' ? 'hidden' : ''}>{' • '}</span>
      </p>
      <div
        className={`${componentSize === 'large' ? 'text-sm' : 'text-xs lg:text-sm'} flex flex-shrink-0 gap-1 font-medium`}
      >
        <p className="text-zinc-400">
          {dict.components.productCard.getConditionLabel(variantCondition)}
        </p>
        {openDetails && (
          <>
            <span>{' • '}</span>
            <Link
              className="font-semibold underline"
              onClick={openDetails}
            >
              {dict.components.productCard.seeDetails}
            </Link>
          </>
        )}
      </div>
    </Wrapper>
  );
};

export default Characteristics;
