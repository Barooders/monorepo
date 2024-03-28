import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import { formatCurrency } from '@/utils/currency';
import B2BPriceOfferButton from './_components/Actions/B2BPriceOfferButton';
import Characteristics from './_components/Characteristics';
import ProductImage from './_components/ProductImage';
import ProductLabel from './_components/ProductLabel';
import ProductPrice from './_components/ProductPrice';
import { B2BProductCardProps } from './types';

const dict = getDictionary('fr');

const ExistingOfferComponent: React.FC = () => {
  return (
    <Button
      disabled={true}
      intent="secondary"
      className="mt-2"
    >
      {dict.b2b.productCard.existingOffer}
    </Button>
  );
};

const B2BProductCard: React.FC<B2BProductCardProps> = ({
  id,
  shopifyId,
  title,
  tags,
  productType,
  variantCondition,
  price,
  compareAtPrice,
  largestBundlePrice,
  image,
  stock,
  hasOpenedPriceOffer,
}) => {
  return (
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
      <div className="relative col-span-2 my-auto flex min-h-[240px] flex-grow flex-col justify-between">
        <Characteristics
          tags={tags}
          title={title}
          productType={productType}
          variantCondition={variantCondition}
          componentSize="medium"
        />
        <div className="flex flex-col">
          <div className="my-1">
            <div className="flex gap-1">
              <p>Unités par lot:</p>
              <div className="w-fit">
                <ProductLabel
                  label={{ content: stock.toString(), color: 'purple' }}
                />
              </div>
            </div>
            <p>P.U.: {formatCurrency(price, { round: true })}€</p>
            <div className="flex items-center gap-1">
              <span className="font-bold">P.U. Lot:</span>
              <ProductPrice
                productId={shopifyId}
                discounts={[]}
                compareAtPrice={compareAtPrice}
                price={largestBundlePrice ?? price}
                showPriceRecap={false}
              />
            </div>
          </div>
          {hasOpenedPriceOffer ? (
            <ExistingOfferComponent />
          ) : (
            <div className="flex gap-2">
              <B2BPriceOfferButton
                productId={id}
                userCanNegociate={true}
              />
              <B2BPriceOfferButton
                productId={id}
                userCanNegociate={false}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default B2BProductCard;
