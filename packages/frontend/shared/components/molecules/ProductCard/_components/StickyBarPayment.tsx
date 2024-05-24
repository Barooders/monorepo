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
  productInternalId: string;
  variantShopifyId: number;
  discounts: Discount[];
  handle: string;
};

const STICKY_BAR_THRESHOLD_PX = 100;

const StickyBarPayment: React.FC<PropsType> = ({
  compareAtPrice,
  price,
  productType,
  variantCondition,
  tags,
  title,
  productInternalId,
  variantShopifyId,
  discounts,
  handle,
}) => {
  const { y } = useWindowScroll();

  return (
    <div
      className="sticky w-full border-t border-gray-300 bg-gray-100 px-4 py-4"
      style={{
        bottom: Math.min(y, STICKY_BAR_THRESHOLD_PX) - STICKY_BAR_THRESHOLD_PX,
      }}
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
              productInternalId={productInternalId}
              componentSize="large"
            />
            <BuyButton
              variantShopifyId={variantShopifyId}
              handle={handle}
              className="flex-grow sm:flex-grow-0 lg:w-80"
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default StickyBarPayment;
