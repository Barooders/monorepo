import ProductVendor from '@/components/molecules/ProductVendor';
import compact from 'lodash/compact';
import BuyButton from '../_components/Actions/BuyButton';
import DetailsButton from '../_components/Actions/DetailsButton';
import Characteristics from '../_components/Characteristics';
import FavoriteButton from '../_components/FavoriteButton';
import ProductGallery from '../_components/ProductGallery';
import ProductPrice from '../_components/ProductPrice';
import SplittedPayments from '../_components/SplittedPayments';
import { ProductSingleVariant } from '../types';

const FullProductCard: React.FC<ProductSingleVariant> = ({
  id,
  shopifyId,
  images,
  vendor,
  labels,
  title,
  commissionAmount,
  tags,
  productType,
  variantCondition,
  handle,
  variantShopifyId: variantId,
  compareAtPrice,
  price,
  isSoldOut,
  discounts,
}) => {
  return (
    <div className="grid w-full grid-cols-2 gap-5 overflow-hidden">
      <div className="relative col-span-2 h-72 w-full flex-grow overflow-hidden lg:col-span-1">
        {images && (
          <ProductGallery
            images={compact(images)}
            labels={labels}
            isSoldOut={isSoldOut}
          />
        )}
      </div>
      <div className="col-span-2 my-auto flex w-full flex-grow flex-col gap-3 lg:col-span-1">
        <div className="flex w-full justify-between">
          <div className="flex w-full flex-col gap-2">
            <Characteristics
              tags={tags}
              title={title}
              productType={productType}
              variantCondition={variantCondition}
              componentSize="large"
            />
            {vendor.name && (
              <div className="w-full">
                <ProductVendor
                  vendor={vendor.name}
                  withLink={true}
                  productInternalId={id}
                  size="card"
                  isPro={vendor.isPro}
                />
              </div>
            )}
          </div>
        </div>
        <ProductPrice
          productId={shopifyId}
          compareAtPrice={compareAtPrice}
          price={price}
          commissionAmount={commissionAmount}
          discounts={discounts}
        />
        {price > 60 && <SplittedPayments price={price} />}

        {!isSoldOut && (
          <div className="flex gap-2">
            <DetailsButton
              className="flex-grow"
              handle={handle}
              variant={variantId}
              productId={shopifyId}
            />
            <BuyButton
              className="flex-grow"
              variant={variantId}
            />
            <FavoriteButton
              intent="square"
              productId={shopifyId}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FullProductCard;
