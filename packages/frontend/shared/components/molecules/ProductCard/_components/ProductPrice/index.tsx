import InfoModal from '@/components/atoms/Modal/InfoModal';
import { getDictionary } from '@/i18n/translate';
import { Discount } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { ProductMultiVariants, Variant } from '../../types';
import CommissionShield from './CommissionShield';
import PriceRecap from './PriceRecap';
import Timer from './Timer';
import { calculateTotalDiscountedPrice } from './lib';

const dict = getDictionary('fr');

const ProductPrice: React.FC<{
  productInternalId: ProductMultiVariants['id'];
  price: Variant['price'];
  compareAtPrice: Variant['compareAtPrice'];
  discounts: Discount[];
  commissionAmount?: ProductMultiVariants['commissionAmount'];
  componentSize?: 'large' | 'medium' | 'small';
  showPriceRecap?: boolean;
}> = ({
  productInternalId,
  price,
  discounts,
  compareAtPrice,
  commissionAmount,
  componentSize = 'medium',
  showPriceRecap = true,
}) => {
  const savingsAmount = Math.floor(compareAtPrice - price);
  const savingsPercent =
    compareAtPrice && compareAtPrice > price
      ? Math.floor((1 - price / compareAtPrice) * 100)
      : 0;
  const showSavings = savingsPercent < 10 && savingsAmount > 10;
  const discountedPrice = calculateTotalDiscountedPrice(discounts, price);
  const hasDiscount = discountedPrice !== price;
  const showCompareAtPrice =
    !!compareAtPrice && !!savingsPercent && savingsPercent > 1;
  const referencePrice = discountedPrice ?? price;
  const discountDeadline = discounts.find(
    (discount) => !!discount.endsAt,
  )?.endsAt;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <div className="flex items-end gap-2">
          <div
            className={`font-semibold tracking-tighter ${
              hasDiscount ? 'text-slate-600' : 'text-slate-800'
            } ${
              componentSize === 'large' && !hasDiscount
                ? 'text-2xl lg:text-3xl'
                : (componentSize === 'large' && hasDiscount) ||
                    (componentSize === 'medium' && !hasDiscount)
                  ? 'text-base lg:text-xl'
                  : 'text-sm lg:text-base'
            }`}
          >
            {formatCurrency(price)}€
          </div>

          {showCompareAtPrice && (
            <div
              className={`${
                componentSize === 'large' && !hasDiscount
                  ? 'text-lg lg:text-xl'
                  : (componentSize === 'large' && hasDiscount) ||
                      (componentSize === 'medium' && !hasDiscount)
                    ? 'text-sm lg:text-lg'
                    : 'text-xs lg:text-sm'
              } text-gray-400 line-through`}
            >
              {formatCurrency(compareAtPrice, { round: true })}€
            </div>
          )}
        </div>

        {showCompareAtPrice && (
          <>
            {savingsPercent > 10 || showSavings ? (
              <div
                className={`rounded-sm px-[2px] py-[1px] font-semibold ${
                  !hasDiscount && (savingsPercent > 30 || savingsAmount > 100)
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-slate-600'
                } ${
                  componentSize === 'small' || hasDiscount
                    ? 'text-sm'
                    : 'text-xs'
                }`}
              >
                {showSavings
                  ? `-${formatCurrency(savingsAmount)}€`
                  : `-${savingsPercent}%`}
              </div>
            ) : null}
          </>
        )}
        {showPriceRecap && (
          <InfoModal
            contentComponent={
              <div className="pt-3">
                <PriceRecap
                  productInternalId={productInternalId}
                  commissionAmount={commissionAmount}
                  discounts={discounts}
                  mainPrice={price}
                  mainDiscountedPrice={discountedPrice}
                  compareAtPrice={compareAtPrice}
                  savingsAmount={savingsAmount}
                  savingsPercent={savingsPercent}
                />
              </div>
            }
          />
        )}
      </div>

      {(hasDiscount || discountDeadline) && (
        <div
          className={`flex items-center gap-2 ${
            componentSize === 'large' ? 'py-2' : ''
          }`}
        >
          {!!hasDiscount && (
            <div
              className={`font-semibold tracking-tighter text-red-600 ${
                componentSize === 'large'
                  ? 'text-2xl lg:text-3xl'
                  : componentSize === 'medium'
                    ? 'text-base lg:text-xl'
                    : 'text-sm lg:text-base'
              }`}
            >
              {formatCurrency(discountedPrice, { round: true })}€
            </div>
          )}
          {!!discountDeadline && <Timer endDate={discountDeadline} />}
        </div>
      )}

      {!!commissionAmount && (
        <div className="flex items-center gap-1 text-slate-600">
          <span
            className={`${componentSize === 'small' ? 'text-xs' : 'text-sm'}`}
          >
            {formatCurrency(referencePrice + commissionAmount)}€{' '}
            {dict.components.productCard.commissionIncluded}
          </span>
          <CommissionShield />
        </div>
      )}
    </div>
  );
};

export default ProductPrice;
