import { Metafield } from '@libs/domain/product.interface';
import { MetafieldType } from '@libs/domain/types';
import { getPimDynamicAttribute } from '@libs/infrastructure/strapi/strapi.helper';
import { head } from 'lodash';
import { getTagsObject } from './shopify.helper';

export const getSEOMetafields = async (product: {
  title: string;
  tags: string[];
  product_type: string;
}): Promise<Metafield[]> => {
  const { title, product_type: productType, tags } = product;

  const tagsObject = getTagsObject(tags);

  const { marque: brand, genre: gender, couleur: color } = tagsObject;
  const size = await getPimDynamicAttribute('size', tagsObject);
  const singleBrand = head(brand);
  const singleGender = head(gender);
  const singleColor = head(color);
  const singleSize = size?.length === 1 ? head(size) : undefined;

  return [
    {
      key: 'title_tag',
      value: `${[
        productType,
        singleBrand,
        title,
        singleGender,
        singleSize,
        singleColor,
      ]
        .filter(Boolean)
        .join(' ')} | Barooders`,
      type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
      namespace: 'global',
    },
    {
      key: 'description_tag',
      value: `Achat de ${productType}${
        singleBrand ? `, de la marque ${singleBrand}` : ''
      }${
        singleGender && singleGender.toLowerCase() !== 'mixte'
          ? `, pour ${singleGender}`
          : ''
      }${
        singleColor ? `, de couleur ${singleColor}` : ''
      } au meilleur prix sur Barooders !`,
      type: MetafieldType.SINGLE_LINE_TEXT_FIELD,
      namespace: 'global',
    },
  ];
};
