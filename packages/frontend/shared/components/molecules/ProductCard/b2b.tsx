import Button from '@/components/atoms/Button';
import Link from '../../atoms/Link';
import Characteristics from './_components/Characteristics';
import ProductImage from './_components/ProductImage';
import ProductPrice from './_components/ProductPrice';
import { B2BProductCardProps } from './types';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

const B2BProductCard: React.FC<B2BProductCardProps> = ({
  shopifyId: id,
  title,
  tags,
  productType,
  variantCondition,
  price,
  compareAtPrice,
  image,
  stock,
  handle,
}) => {
  return (
    <Link href={`/products/${handle}`}>
      <div className="grid w-full grid-cols-2 gap-1 overflow-hidden">
        <div className="relative col-span-2 h-52 w-full flex-grow sm:h-64">
          {image && (
            <ProductImage
              image={image}
              labels={[]}
              discounts={[]}
            />
          )}
        </div>
        <div className="relative col-span-2 my-auto flex min-h-[210px] flex-grow flex-col justify-between">
          <Characteristics
            tags={tags}
            title={title}
            productType={productType}
            variantCondition={variantCondition}
            componentSize="medium"
          />
          <div className="flex flex-col">
            <p className="mt-2 text-xs text-gray-600 lg:text-sm">
              {dict.b2b.productCard.availableQuantity}: {stock}
            </p>
            <div className="my-1">
              <ProductPrice
                productId={id}
                discounts={[]}
                compareAtPrice={compareAtPrice}
                price={price}
              />
            </div>
            <Button
              intent="tertiary"
              href="/"
              className="mt-2"
            >
              {dict.b2b.productCard.makeAnOffer}
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default B2BProductCard;
