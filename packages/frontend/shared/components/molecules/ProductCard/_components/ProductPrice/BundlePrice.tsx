import { getDictionary } from '@/i18n/translate';
import { formatCurrency } from '@/utils/currency';
import ProductLabel from '../ProductLabel';

const dict = getDictionary('fr');

type PropsType = {
  compareAtPrice: number;
  largestBundlePrice?: number;
  price: number;
  stock: number;
  className?: string;
};

const BundlePrice: React.FC<PropsType> = ({
  compareAtPrice,
  largestBundlePrice,
  price,
  stock,
  className,
}) => {
  const bundlePrice = largestBundlePrice ?? price;
  const publicPrice = Math.max(compareAtPrice, price);
  const priceWithTaxes = bundlePrice * 1.2;
  const discount = Math.round((1 - priceWithTaxes / publicPrice) * 100);
  const shouldShowPublicPrice = discount > 10;

  return (
    <div className={`flex flex-col gap-2 text-sm md:text-base ${className}`}>
      <div className="flex flex-wrap gap-1">
        <p>{dict.b2b.productCard.price.quantities}:</p>
        <div className="w-fit">
          <ProductLabel
            label={{ content: stock.toString(), color: 'purple' }}
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 overflow-hidden">
        <div className="flex flex-wrap gap-1 whitespace-nowrap md:flex-nowrap">
          <div>{dict.b2b.productCard.price.priceStartsAt} :</div>
          <div className="w-full font-bold">
            {formatCurrency(bundlePrice)}€ {dict.b2b.productCard.price.dutyFree}{' '}
            / {dict.b2b.productCard.price.unit}
          </div>
        </div>
        <div className="flex flex-wrap gap-1 whitespace-nowrap text-xs font-light md:flex-nowrap md:text-sm">
          {shouldShowPublicPrice ? (
            <>
              <div>{dict.b2b.productCard.price.publicPrice} :</div>
              <div>
                {formatCurrency(publicPrice)}€{' '}
                {dict.b2b.productCard.price.taxIncluded} (-{discount}%)
              </div>
            </>
          ) : (
            <>&nbsp;</>
          )}
        </div>
      </div>
    </div>
  );
};

export default BundlePrice;
