import { getDictionary } from '@/i18n/translate';
import { Discount } from '@/types';
import ProductLabel from '../ProductLabel';

const dict = getDictionary('fr');

type PropsType = {
  discount: Discount;
  displayCode: boolean;
  sticked: boolean;
};

const buildLabelContent = (discount: Discount, displayCode: boolean) => {
  if (displayCode && discount.code)
    return `${dict.components.productCard.discount.discountCode} : ${discount.code}`;
  if (!discount.hideReduction)
    return `-${discount.value}${
      discount.valueType === 'fixed_amount' ? '€' : '%'
    } ${discount.label}`;

  return discount.label;
};

const DiscountLabel: React.FC<PropsType> = ({
  discount,
  displayCode,
  sticked,
}) => {
  return (
    <ProductLabel
      label={{
        color: 'primary',
        content: buildLabelContent(discount, displayCode),
      }}
      stickSide={sticked ? 'left' : undefined}
    />
  );
};

export default DiscountLabel;
