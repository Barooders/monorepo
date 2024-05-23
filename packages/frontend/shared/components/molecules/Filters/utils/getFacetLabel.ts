import { getProductConfigFromAttributeName } from '@/config/productAttributes';
import { getDictionary } from '@/i18n/translate';
import capitalize from 'lodash/capitalize';

const dict = getDictionary('fr');

export const getFacetValueLabel = (facetName: string, facetValue: string) => {
  const translatedFaceValue =
    dict.components.productCard.getFacetValueLabel(facetValue);

  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (translatedFaceValue) return translatedFaceValue;

  if (facetValue.length <= 3) return facetValue.toUpperCase();

  if (getProductConfigFromAttributeName(facetName)?.capitalize === false)
    return facetValue;

  return capitalize(facetValue);
};

export const getFacetLabel = (facetName: string) =>
  // @ts-expect-error Implicit Any
  dict.search.facets[facetName] ??
  capitalize(facetName.replace('array_tags.', '').replaceAll('-', ' '));
