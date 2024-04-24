import { sendClickProduct } from '@/analytics';
import ProductVendor from '@/components/molecules/ProductVendor';
import first from 'lodash/first';
import Link from '@/components/atoms/Link';
import Characteristics from '../_components/Characteristics';
import FavoriteButton from '../_components/FavoriteButton';
import ProductImage from '../_components/ProductImage';
import ProductPrice from '../_components/ProductPrice';
import { ProductSingleVariant } from '../types';

const MediumProductCard: React.FC<ProductSingleVariant> = ({
  shopifyId,
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

  const productImage = first(images);
  const mainProductDiscount = first(discounts);
  return (
    <Link
      href={productLink.toString()}
      onClick={() => sendClickProduct(shopifyId)}
      className={`${className}`}
    >
      <div className="grid w-full grid-cols-2 gap-1 overflow-hidden">
        <div className="relative col-span-2 h-52 w-full flex-grow sm:h-64">
          {productImage && (
            <ProductImage
              image={productImage}
              labels={labels}
              discounts={mainProductDiscount ? [mainProductDiscount] : []}
            />
          )}
        </div>
        <div className="relative col-span-2 my-auto flex flex-grow flex-col">
          <div className="absolute right-0 top-0 rounded-full bg-white p-1">
            <FavoriteButton productId={shopifyId} />
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
              productId={shopifyId}
              discounts={discounts}
              compareAtPrice={compareAtPrice}
              price={price}
            />
          </div>
          {vendor.name && (
            <ProductVendor
              vendor={vendor.name}
              reviewCount={vendor.reviews.count}
              rating={vendor.reviews.averageRating}
              withSeeAllLink={false}
            />
          )}
        </div>
      </div>
    </Link>
  );
};

export default MediumProductCard;
