import PageContainer from '@/components/atoms/PageContainer';
import { Condition } from '@/components/pages/SellingForm/types';
import { Discount } from '@/types';
import { useWindowScroll } from 'react-use';
import BuyButton from './Actions/BuyButton';
import Characteristics from './Characteristics';
import ProductPrice from './ProductPrice';

type PropsType = {
  productType: string;
  variantCondition: Condition;
  tags: Record<string, string>;
  title: string;
  compareAtPrice: number;
  price: number;
  productId: string;
  variantId: string;
  discounts: Discount[];
};

const StickyBarPayment: React.FC<PropsType> = ({
  compareAtPrice,
  price,
  productType,
  variantCondition,
  tags,
  title,
  productId,
  variantId,
  discounts,
}) => {
  const { y } = useWindowScroll();

  return (
    <div
      className="sticky bottom-0 w-full border-t border-gray-300 bg-gray-100 px-4 py-4"
      style={{ opacity: Math.min(y, 100) / 100 }}
    >
      <PageContainer includeVerticalPadding={false}>
        <div className="flex w-full justify-end sm:justify-between">
          <Characteristics
            productType={productType}
            variantCondition={variantCondition}
            tags={tags}
            title={title}
            componentSize="large"
            direction="inline"
            className="hidden overflow-hidden sm:flex"
          />
          <div className="flex flex-grow items-center gap-4 sm:flex-grow-0 sm:pl-4">
            <ProductPrice
              compareAtPrice={compareAtPrice}
              price={price}
              discounts={discounts}
              productId={productId}
              componentSize="large"
            />
            <BuyButton
              variant={variantId}
              className="flex-grow sm:flex-grow-0 lg:w-80"
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default StickyBarPayment;
