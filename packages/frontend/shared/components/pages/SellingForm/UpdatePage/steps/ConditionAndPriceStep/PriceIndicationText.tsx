import { getDictionary } from '@/i18n/translate';
import { useCallback, useEffect, useState } from 'react';
import { Condition } from '../../../types';
import useSellForm from '../../../_state/useSellForm';

const dict = getDictionary('fr');
const conditionAndPriceLabels = dict.sellingForm.conditionAndPriceStep;

interface PriceIndicationTextProps {
  price: string;
  originalPrice: string;
}

const handleProductMaxDiscount = (condition: Condition | null) => {
  if (condition === Condition.AS_NEW) {
    return 50;
  }

  if (condition === Condition.VERY_GOOD) {
    return 60;
  }

  return 70;
};

const PriceIndicationText = ({
  price,
  originalPrice,
}: PriceIndicationTextProps) => {
  const [error, setError] = useState<boolean>(false);
  const {
    productInfos: { condition },
  } = useSellForm();
  const [productStateDiscount] = useState<number>(
    handleProductMaxDiscount(condition),
  );
  const [priceAdviced, setPriceAdviced] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  useEffect(() => {
    if (parseFloat(originalPrice) > 0) {
      const adviced =
        parseInt(originalPrice, 10) -
        (parseInt(originalPrice, 10) * productStateDiscount) / 100;

      if (adviced > 0) {
        setPriceAdviced(adviced);
      }
    }

    if (parseInt(originalPrice, 10) < parseInt(price, 10)) {
      setError(true);
    } else {
      setError(false);
    }

    if (parseFloat(price) > 0 && parseFloat(originalPrice) > 0) {
      const discountFromOriginalPrice =
        100 - (parseFloat(price) / parseFloat(originalPrice)) * 100;

      if (discountFromOriginalPrice >= 0) {
        setDiscountPercent(discountFromOriginalPrice);
      }

      if (discountFromOriginalPrice < 0) {
        setDiscountPercent(0);
      }
    } else {
      setDiscountPercent(0);
    }
  }, [discountPercent, originalPrice, price]);

  // PRICE ADVICE SECTION
  const handlePriceAdviced = useCallback(() => {
    let bgAlert = 'bg-gray-300';

    if (discountPercent >= productStateDiscount) {
      bgAlert = 'bg-green-300';
    }

    if (discountPercent < productStateDiscount && discountPercent >= 20) {
      bgAlert = 'bg-orange-300';
    }

    if (
      discountPercent < 20 &&
      discountPercent >= 0 &&
      parseInt(price, 10) > 0
    ) {
      bgAlert = 'bg-red-300';
    }

    if (parseFloat(originalPrice) > 0) {
      return (
        <div className={`mb-2 mt-5 w-full rounded py-1 px-2 ${bgAlert}`}>
          <p>{`${conditionAndPriceLabels.priceAdvised} : < ${parseInt(
            priceAdviced.toString(),
            10,
          )}€`}</p>
        </div>
      );
    }
  }, [originalPrice, discountPercent, priceAdviced]);

  // TEXT ADVICE SECTION
  const handleText = useCallback(() => {
    if (discountPercent >= productStateDiscount) {
      return (
        <>
          <p className="text-secondary-content">
            {conditionAndPriceLabels.priceAdvices.ideal}
          </p>
        </>
      );
    }

    if (discountPercent < productStateDiscount && discountPercent > 0) {
      return (
        <>
          <p className="text-secondary-content">
            {conditionAndPriceLabels.priceAdvices.lower}
          </p>
        </>
      );
    }

    return (
      <p className="text-secondary-content">
        {conditionAndPriceLabels.priceAdvices.correct}
      </p>
    );
  }, [discountPercent, price, originalPrice]);

  if (error) {
    return (
      <p className="text-primary font-medium">
        {conditionAndPriceLabels.priceAdvices.impossible}
      </p>
    );
  }

  return (
    <>
      {handlePriceAdviced()}
      {handleText()}
    </>
  );
};

export default PriceIndicationText;
