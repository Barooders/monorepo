import { fetchCommission } from '@/clients/commission';
import Loader from '@/components/atoms/Loader';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { Discount } from '@/types';
import { formatCurrency } from '@/utils/currency';
import { useEffect } from 'react';
import CommissionShield from './CommissionShield';
import Timer from './Timer';
import { calculateDiscountedPrice } from './lib';

const dict = getDictionary('fr');

type PropsType = {
  productInternalId: string;
  mainPrice: number;
  mainDiscountedPrice?: number;
  discounts: Discount[];
  commissionAmount?: number;
  compareAtPrice?: number;
  savingsPercent?: number;
  savingsAmount?: number;
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

const PriceRecap: React.FC<PropsType> = ({
  productInternalId,
  mainPrice,
  mainDiscountedPrice,
  discounts,
  commissionAmount,
  compareAtPrice,
  savingsPercent,
  savingsAmount,
}) => {
  const discountLabel = dict.components.productCard.price;
  const hasDiscount = discounts.length > 0;
  const discountDeadline = discounts.find(
    (discount) => !!discount.endsAt,
  )?.endsAt;

  const [commissionState, doFetchCommission] =
    useWrappedAsyncFn(fetchCommission);

  useEffect(() => {
    if (!commissionAmount) {
      doFetchCommission({ productInternalId });
    }
  }, []);

  if (commissionState.loading)
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader />
      </div>
    );

  const commission = commissionAmount ?? commissionState.value;
  const showSavings = !!compareAtPrice && !!savingsPercent && !!savingsAmount;

  return (
    <div className="flex w-full flex-col gap-4 text-sm xs:text-base">
      <div className="flex flex-col gap-1">
        <PriceLine
          className="text-gray-600"
          label={discountLabel.mainPrice}
          price={`${formatCurrency(mainPrice)} €`}
        />
        {discounts.map((discount) => {
          const discountedPrice = calculateDiscountedPrice(discount, mainPrice);
          if (!discountedPrice) return <></>;

          return (
            <PriceLine
              key={discount.title}
              className="text-gray-600"
              label={
                <div className="flex flex-col">
                  <p>
                    <span className="hidden xs:inline">
                      {discountLabel.reduction}
                    </span>
                    <span> {discount.label}</span>
                  </p>
                  {discount.code && (
                    <p className="text-xs text-gray-500">
                      {discountLabel.withCode} : {discount.code}
                    </p>
                  )}
                </div>
              }
              price={`-${formatCurrency(discountedPrice)} €`}
            />
          );
        })}
        {commission && (
          <PriceLine
            className="text-gray-600"
            label={
              <div className="flex items-center gap-1">
                {discountLabel.commission}
                <CommissionShield />
              </div>
            }
            price={`${formatCurrency(commission)} €`}
          />
        )}
      </div>
      <div className="h-[1px] w-full bg-gray-200" />
      <div className="flex flex-col gap-1">
        {hasDiscount && (
          <PriceLine
            className="text-gray-500"
            label={
              <div className="flex flex-col items-start gap-1 xs:flex-row xs:items-center">
                <p className="font-semibold text-gray-700">
                  {discountLabel.total}
                </p>{' '}
                <p>{discountLabel.beforeDiscount}</p>
              </div>
            }
            price={
              <p className="font-semibold">{`${formatCurrency(
                mainPrice + (commission ?? 0),
              )} €`}</p>
            }
          />
        )}
        <PriceLine
          className="mt-2 text-lg"
          label={
            <div className="flex flex-col items-start gap-1 xs:flex-row xs:items-center">
              <p className="font-semibold">{discountLabel.total}</p>{' '}
              <div className="flex">
                {discountDeadline && <Timer endDate={discountDeadline} />}
              </div>
            </div>
          }
          price={
            <p className="font-semibold text-primary-500">{`${formatCurrency(
              (mainDiscountedPrice ?? mainPrice) + (commission ?? 0),
            )} €`}</p>
          }
        />
        {showSavings && (
          <div className="mt-4 rounded bg-gray-100 p-3 text-xs xs:text-base">
            <PriceLine
              label={
                <div className="max-w-[250px]">
                  <p className="font-semibold text-gray-900">
                    {discountLabel.savingsMade}
                  </p>
                  <p className="text-xs font-normal text-gray-400 xs:text-sm">
                    <span className="hidden xs:inline">
                      {discountLabel.compareAt}
                    </span>
                    <span className="inline xs:hidden">
                      {discountLabel.shortCompareAt}
                    </span>
                    : {formatCurrency(compareAtPrice)} €
                  </p>
                </div>
              }
              price={
                <div className="flex flex-col items-end text-gray-600">
                  <p>
                    <span className="font-semibold">-{savingsPercent}% </span>
                    <span className="font-base">{discountLabel.so}</span>
                  </p>
                  <p className="font-semibold">
                    {savingsAmount}€ {discountLabel.saved}
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

export default PriceRecap;
