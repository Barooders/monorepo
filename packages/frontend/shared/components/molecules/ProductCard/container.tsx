import capitalize from 'lodash/capitalize';
import flow from 'lodash/flow';
import groupBy from 'lodash/groupBy';
import isArray from 'lodash/isArray';
import mapValues from 'lodash/mapValues';
import { RawVariant, Variant } from './types';

export const getVariantToSelect = (variants: Variant[], variantId?: string) => {
  const availableVariants = variants.filter(({ available }) => available);
  return (
    availableVariants.find(({ shopifyId: id }) => id === variantId) ??
    availableVariants[0] ??
    variants[0]
  );
};

type TagType = { tag: string | null; value: string | null };

export const extractTags: (tags: TagType[]) => Record<string, string> = flow([
  (tags) => groupBy(tags, (tag) => tag.tag),
  (tags) =>
    mapValues(tags, (values) =>
      values.map(({ value }: TagType) => capitalize(value ?? '')),
    ),
  (tags) =>
    mapValues(tags, (values) =>
      isArray(values) ? values.join(' / ') : values,
    ),
]);

export const createVariantName = (variant: RawVariant): string =>
  [
    { name: variant?.option1Name, value: variant?.option1 },
    { name: variant?.option2Name, value: variant?.option2 },
    { name: variant?.option3Name, value: variant?.option3 },
  ]
    .filter((option) => !!option.name)
    .map((selectedOption) => `${selectedOption.name}: ${selectedOption.value}`)
    .join(' / ');
