import { ProductSingleVariant } from './types';
import Characteristics from './_components/Characteristics';
import FavoriteButton from './_components/FavoriteButton';
import ProductPrice from './_components/ProductPrice';
import ProductVendor from './_components/ProductVendor';
import ProductGallery from './_components/ProductGallery';
import SplittedPayments from './_components/SplittedPayments';
import compact from 'lodash/compact';
import BuyButton from './_components/Actions/BuyButton';
import DetailsButton from './_components/Actions/DetailsButton';

const FullProductCard: React.FC<ProductSingleVariant> = ({
  shopifyId: id,
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
      <div className="col-span-2 my-auto flex flex-grow flex-col lg:col-span-1 lg:gap-2">
        <div className="flex w-full justify-between">
          <div className="flex flex-col gap-2">
            <Characteristics
              tags={tags}
              title={title}
              productType={productType}
              variantCondition={variantCondition}
              componentSize="large"
            />
            {vendor.name && (
              <ProductVendor
                vendor={vendor.name}
                withLink={true}
              />
            )}
          </div>
          <div className="shrink-0 cursor-pointer p-1">
            <FavoriteButton productId={id} />
          </div>
        </div>
        <div className="my-1">
          <ProductPrice
            productId={id}
            compareAtPrice={compareAtPrice}
            price={price}
            commissionAmount={commissionAmount}
            discounts={discounts}
          />
        </div>
        {price > 60 && (
          <div className="mt-3">
            <SplittedPayments price={price} />
          </div>
        )}

        {!isSoldOut && (
          <div className="mt-6 grid w-full grid-cols-2 gap-2">
            <BuyButton
              className="col-span-1"
              variant={variantId}
            />
            <DetailsButton
              className="col-span-1"
              handle={handle}
              variant={variantId}
              productId={id}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FullProductCard;
