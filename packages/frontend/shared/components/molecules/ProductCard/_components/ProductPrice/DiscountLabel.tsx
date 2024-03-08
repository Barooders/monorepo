import { getDictionary } from '@/i18n/translate';
import { Discount } from '@/types';
import ProductLabel from '../ProductLabel';

const dict = getDictionary('fr');

type PropsType = {
  discount: Discount;
  displayDetails: boolean;
  sticked: boolean;
};

const buildLabelContent = (discount: Discount, displayDetails: boolean) => {
  if (displayDetails && discount.description) {
    return `${discount.label} : ${discount.description}`;
  }

  if (displayDetails && discount.code) {
    return `${dict.components.productCard.discount.discountCode} : ${discount.code}`;
  }

  if (!discount.hideReduction)
    return `-${discount.value}${
      discount.valueType === 'fixed_amount' ? '€' : '%'
    } ${discount.label}`;

  return discount.label;
};

const DiscountLabel: React.FC<PropsType> = ({
  discount,
  displayDetails,
  sticked,
}) => {
  return (
    <ProductLabel
      label={{
        color: 'primary',
        content: buildLabelContent(discount, displayDetails),
      }}
      stickSide={sticked ? 'left' : undefined}
    />
  );
};

export default DiscountLabel;
