import { sendClickProduct } from '@/analytics';
import Link from '@/components/atoms/Link';
import ProductVendor from '@/components/molecules/ProductVendor';
import first from 'lodash/first';
import Characteristics from '../_components/Characteristics';
import FavoriteButton from '../_components/FavoriteButton';
import ProductImage from '../_components/ProductImage';
import ProductPrice from '../_components/ProductPrice';
import { ProductSingleVariant } from '../types';

const SmallProductCard: React.FC<ProductSingleVariant> = ({
  id,
  productMerchantItemId,
  title,
  images,
  labels,
  vendor,
  tags,
  productType,
  variantCondition,
  productLink,
  compareAtPrice,
  price,
  isSoldOut,
  className,
  discounts,
}) => {
  if (isSoldOut) return <></>;

  const simplifiedLabels = labels.filter((label) => label.position !== 'left');

  const productImage = first(images);
  return (
    <Link
      href={productLink}
      onClick={() => sendClickProduct({ productMerchantItemId })}
      className={`h-full w-36 shrink-0 sm:w-52 lg:w-72 ${className}`}
    >
      <div className="grid w-full grid-cols-2 gap-1 overflow-hidden">
        <div className="relative col-span-2 h-32 w-full flex-grow sm:h-52">
          {productImage && (
            <ProductImage
              image={productImage}
              labels={simplifiedLabels}
              discounts={discounts}
            />
          )}
        </div>
        <div className="relative col-span-2 my-auto flex flex-grow flex-col">
          <div className="absolute right-0 top-0 shrink-0 cursor-pointer rounded-full bg-white p-1">
            <FavoriteButton internalProductId={id} />
          </div>
          <Characteristics
            tags={tags}
            title={title}
            productType={productType}
            variantCondition={variantCondition}
            componentSize="medium"
          />

          <div className="my-1">
            <ProductPrice
              productInternalId={id}
              compareAtPrice={compareAtPrice}
              price={price}
              componentSize="small"
              discounts={discounts}
            />
          </div>
          {vendor.name !== null && <ProductVendor vendor={vendor.name} />}
        </div>
      </div>
    </Link>
  );
};

export default SmallProductCard;
