import { sendClickProduct } from '@/analytics';
import first from 'lodash/first';
import Link from '../../atoms/Link';
import { ProductSingleVariant } from './types';
import Characteristics from './_components/Characteristics';
import FavoriteButton from './_components/FavoriteButton';
import ProductImage from './_components/ProductImage';
import ProductPrice from './_components/ProductPrice';
import ProductVendor from './_components/ProductVendor';

const MediumProductCard: React.FC<ProductSingleVariant> = ({
  shopifyId: id,
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
      onClick={() => sendClickProduct(id)}
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
          <div className="absolute top-0 right-0 rounded-full bg-white p-1">
            <FavoriteButton productId={id} />
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
              productId={id}
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
