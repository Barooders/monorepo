import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import { formatCurrency } from '@/utils/currency';
import Characteristics from './_components/Characteristics';
import ProductImage from './_components/ProductImage';
import ProductPrice from './_components/ProductPrice';
import { B2BProductCardProps } from './types';

const dict = getDictionary('fr');

const B2BProductCard: React.FC<B2BProductCardProps> = ({
  shopifyId: id,
  title,
  tags,
  productType,
  variantCondition,
  price,
  compareAtPrice,
  largestBundlePrice,
  image,
  stock,
}) => {
  return (
    <div className="grid w-full grid-cols-2 gap-1 overflow-hidden">
      <div className="relative col-span-2 h-52 w-full flex-grow sm:h-64">
        {image && (
          <ProductImage
            image={image}
            labels={[
              { content: <>x {stock}</>, position: 'right', color: 'purple' },
            ]}
            discounts={[]}
          />
        )}
      </div>
      <div className="relative col-span-2 my-auto flex min-h-[200px] flex-grow flex-col justify-between">
        <Characteristics
          tags={tags}
          title={title}
          productType={productType}
          variantCondition={variantCondition}
          componentSize="medium"
        />
        <div className="flex flex-col">
          <div className="my-1">
            {largestBundlePrice && (
              <p className="text-xs text-gray-600 lg:text-sm">
                <span>{dict.b2b.productCard.largestBundlePrice}:</span>
                <span className="ml-1 font-bold">
                  {formatCurrency(largestBundlePrice, { round: true })}€
                </span>
              </p>
            )}
            <ProductPrice
              productId={id}
              discounts={[]}
              compareAtPrice={compareAtPrice}
              price={price}
              showPriceRecap={false}
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
  );
};

export default B2BProductCard;
