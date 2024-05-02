import InfoModal from '@/components/atoms/Modal/InfoModal';
import { getDictionary } from '@/i18n/translate';
import { formatCurrency } from '@/utils/currency';
import B2BPriceRecap from './B2BPriceRecap';

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
  const shouldShowPublicPrice = discount > 1;
  const shouldShowDiscount = discount > 10;

  return (
    <div
      className={`flex flex-col text-sm !leading-tight md:text-base md:!leading-tight ${className}`}
    >
      <div className="flex flex-wrap">
        <p className="text-zinc-400">
          {dict.b2b.productCard.price.quantities} :&nbsp;
        </p>
        <p className="font-semibold">{stock.toString()}</p>
      </div>
      <div className="flex flex-col overflow-hidden">
        <div className="flex flex-wrap items-center whitespace-nowrap md:flex-nowrap">
          <div className="text-zinc-400">
            {dict.b2b.productCard.price.priceStartsAt} :&nbsp;
          </div>
          <div className="text-base font-bold md:text-lg">
            {formatCurrency(bundlePrice)}€ {dict.b2b.productCard.price.dutyFree}{' '}
            / {dict.b2b.productCard.price.unit}
          </div>
          <div className="ml-1 pt-1 text-sm">
            <InfoModal
              contentComponent={
                <B2BPriceRecap
                  bundleSize={stock}
                  unitPrice={price}
                  largestBundlePrice={largestBundlePrice}
                  compareAtPrice={compareAtPrice}
                />
              }
            />
          </div>
        </div>
        <div className="flex flex-col whitespace-nowrap text-xs text-zinc-400 md:flex-row md:text-sm">
          <div>
            {shouldShowPublicPrice &&
              `${dict.b2b.productCard.price.publicPrice} :`}
            &nbsp;
          </div>
          <div>
            {shouldShowPublicPrice ? (
              `${formatCurrency(publicPrice)}€ ${dict.b2b.productCard.price.taxIncluded}${shouldShowDiscount ? ` (-${discount}%)` : ''}`
            ) : (
              <>&nbsp;</>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BundlePrice;
