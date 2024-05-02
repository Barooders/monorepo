import { getDictionary } from '@/i18n/translate';
import { formatCurrency } from '@/utils/currency';
import { addTaxes } from './lib';

const dict = getDictionary('fr');

type PropsType = {
  unitPrice: number;
  largestBundlePrice?: number;
  bundleSize: number;
  compareAtPrice?: number;
};

const PriceLine: React.FC<{
  label: React.ReactNode;
  price: React.ReactNode;
  className?: string;
}> = ({ label, price, className }) => (
  <div className={`${className} flex justify-between`}>
    <p>{label}</p>
    <p>{price}</p>
  </div>
);

const B2BPriceRecap: React.FC<PropsType> = ({
  unitPrice,
  largestBundlePrice,
  bundleSize,
  compareAtPrice,
}) => {
  const priceLabels = dict.components.productCard.price;
  const bundlePrice = largestBundlePrice ?? unitPrice;
  const priceTaxIncluded = addTaxes(bundlePrice);
  const showSavings = compareAtPrice && compareAtPrice > priceTaxIncluded * 1.1;
  const bundleTotalPrice = bundlePrice * bundleSize;

  return (
    <div className="flex w-full flex-col gap-4 text-sm xs:text-base">
      <div className="flex flex-col gap-1">
        <PriceLine
          className="text-gray-600"
          label={priceLabels.unitPrice}
          price={`${formatCurrency(unitPrice)} €`}
        />
        {largestBundlePrice && (
          <PriceLine
            className="text-gray-600"
            label={priceLabels.bundlePrice}
            price={`${formatCurrency(largestBundlePrice)} €`}
          />
        )}
      </div>
      <div className="h-[1px] w-full bg-gray-200" />
      <div className="flex flex-col gap-1">
        <PriceLine
          className="mt-2 text-lg"
          label={
            <p className="font-semibold">{priceLabels.bundleTotalPrice}</p>
          }
          price={
            <p className="font-semibold text-primary-500">{`${formatCurrency(
              bundleTotalPrice,
            )} €`}</p>
          }
        />
        <PriceLine
          className="text-sm text-gray-500"
          label={priceLabels.taxIncluded}
          price={`${formatCurrency(addTaxes(bundleTotalPrice))} €`}
        />
        {showSavings && (
          <div className="mt-4 rounded bg-gray-100 p-3 text-xs xs:text-base">
            <PriceLine
              label={
                <div className="max-w-[250px]">
                  <p className="font-semibold text-gray-900">
                    {priceLabels.savingsMade}
                  </p>
                  <p className="text-xs font-normal text-gray-400 xs:text-sm">
                    <span className="hidden xs:inline">
                      {priceLabels.compareAt}
                    </span>
                    <span className="inline xs:hidden">
                      {priceLabels.shortCompareAt}
                    </span>
                    : {formatCurrency(compareAtPrice)} €
                  </p>
                </div>
              }
              price={
                <div className="flex flex-col items-end text-gray-600">
                  <p>
                    <span className="font-semibold">
                      -
                      {Math.round(
                        (1 - priceTaxIncluded / compareAtPrice) * 100,
                      )}
                      %{' '}
                    </span>
                    <span className="font-base">{priceLabels.so}</span>
                  </p>
                  <p className="font-semibold">
                    {formatCurrency(
                      (compareAtPrice - priceTaxIncluded) * bundleSize,
                    )}
                    € {priceLabels.saved}
                  </p>
                </div>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default B2BPriceRecap;
