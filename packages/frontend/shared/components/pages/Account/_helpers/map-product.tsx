import { getDictionary } from '@/i18n/translate';
import { Condition } from '../../SellingForm/types';

const dict = getDictionary('fr');
interface GraphQlProduct {
  handle: string | null;
  productType: string | null;
  size: string | null;
  gender: string | null;
  modelYear: string | null;
  brand: string | null;
  firstImage: string | null;
  product?: {
    variants: {
      variant: {
        condition: string | null;
      } | null;
      b2cVariant: {
        price?: number;
      } | null;
    }[];
  } | null;
}

export const mapProductFromGraphQl = ({
  handle,
  productType,
  modelYear,
  brand,
  product,
  size,
  firstImage,
}: GraphQlProduct) => {
  const firstVariant = product?.variants?.[0];

  return {
    key: handle,
    link: `/products/${handle}`,
    tag: productType,
    title: brand,
    description: [
      ...(size
        ? [`${dict.components.productCard.sizeLabel} ${size.toUpperCase()}`]
        : []),
      modelYear,
      firstVariant?.variant?.condition
        ? dict.components.productCard.getConditionLabel(
            firstVariant.variant.condition as Condition,
          )
        : undefined,
    ]
      .filter(Boolean)
      .join(' · '),
    price: firstVariant?.b2cVariant?.price
      ? `${Number(firstVariant.b2cVariant.price).toFixed(2)} €`
      : '',
    imageSrc: firstImage,
  };
};
