import Button from '@/components/atoms/Button';
import Link from '@/components/atoms/Link';
import Modal from '@/components/atoms/Modal';
import { Condition } from '@/components/pages/SellingForm/types';
import { getDictionary } from '@/i18n/translate';
import { FaTags } from 'react-icons/fa';
import { RiMoneyEuroCircleLine } from 'react-icons/ri';
import {
  AvailableOffers,
  bikesCollectionIds,
  electricBikesCollectionIds,
  handicapedBikesCollectionIds,
} from '../config';
import { ProductSingleVariant } from '../types';

const dict = getDictionary('fr');

type PromoCodeType = {
  code: string;
  value: number;
  type: 'amount' | 'percent';
  isAvailable: (product: ProductSingleVariant) => boolean;
};

const promoCodes: PromoCodeType[] = [
  {
    code: 'WELCOME10',
    value: 10,
    type: 'amount',
    isAvailable: (product: ProductSingleVariant) => product.price >= 100,
  },
];

export const getAvailableOffers = (
  productCondition: Condition,
  breadcrumbs: { shopifyId: string }[],
) => {
  const availableOffers: AvailableOffers[] = [];
  if (productCondition !== Condition.AS_NEW) return availableOffers;

  const isElectricBike = breadcrumbs.some(({ shopifyId }) =>
    electricBikesCollectionIds.includes(shopifyId),
  );

  const isMuscleBike = breadcrumbs.some(({ shopifyId }) =>
    bikesCollectionIds.includes(shopifyId),
  );

  const isHandicapedBike = breadcrumbs.some(({ shopifyId }) =>
    handicapedBikesCollectionIds.includes(shopifyId),
  );

  if (isMuscleBike) {
    availableOffers.push(AvailableOffers.MUSCLES_BIKE_SUBVENTION);
  }

  if (isHandicapedBike) {
    availableOffers.push(AvailableOffers.HANDICAPED_BIKE_SUBVENTION);
  }

  if (isElectricBike)
    availableOffers.push(AvailableOffers.ELECTRIC_BIKE_SUBVENTION);

  return availableOffers;
};

export const getSubventionAmount = (availableOffers: AvailableOffers[]) => {
  if (availableOffers.includes(AvailableOffers.HANDICAPED_BIKE_SUBVENTION))
    return 600;
  if (availableOffers.includes(AvailableOffers.ELECTRIC_BIKE_SUBVENTION))
    return 500;
  if (availableOffers.includes(AvailableOffers.MUSCLES_BIKE_SUBVENTION))
    return 100;

  return null;
};

type PropsType = {
  availableOffers: AvailableOffers[];
  product: ProductSingleVariant;
};

const Offers: React.FC<PropsType> = ({ availableOffers, product }) => {
  const subventionAmount = getSubventionAmount(availableOffers);
  const availablePromoCode = promoCodes.find((promoCode) =>
    promoCode.isAvailable(product),
  );
  return (
    <div className="flex flex-col gap-2">
      {subventionAmount && (
        <div className="flex flex-col gap-1 rounded-lg border border-purple-600 bg-purple-100 bg-opacity-70 p-3">
          <p className="flex items-center gap-2 text-sm font-medium uppercase">
            <RiMoneyEuroCircleLine className="text-purple-600" />
            {dict.components.productCard.offers.subventionTitle}
          </p>
          <div className="text-sm font-light text-slate-600">
            {dict.components.productCard.offers.subventionExplanation({
              amount: subventionAmount,
            })}
            <div className="mt-2">
              <Modal
                ButtonComponent={({ openModal }) => (
                  <Link onClick={openModal}>
                    {dict.components.productCard.offers.subventionLink()}
                  </Link>
                )}
                ContentComponent={() => (
                  <div className="flex w-full flex-col gap-5">
                    <p className="text-center text-xl font-semibold">
                      {dict.components.productCard.offers.subventionContactUs}
                    </p>
                    <div className="flex w-full justify-center gap-3">
                      <Button
                        intent="secondary"
                        onClick={() => window.GorgiasChat.open()}
                        className="w-full"
                      >
                        {dict.components.productCard.offers.byChat}
                      </Button>
                      <Button
                        intent="tertiary"
                        href="tel:+33189713290"
                        className="w-full"
                      >
                        {dict.components.productCard.offers.byPhone}
                      </Button>
                    </div>
                  </div>
                )}
              />
            </div>
          </div>
        </div>
      )}
      {availablePromoCode && (
        <div className="flex flex-col gap-1 rounded-lg border border-blue-600 bg-blue-100 bg-opacity-70 p-3">
          <p className="flex items-center gap-2 text-sm font-medium uppercase">
            <FaTags className="text-blue-600" />
            {availablePromoCode.value}{' '}
            {availablePromoCode.type === 'amount' ? '€' : '%'}{' '}
            {dict.components.productCard.offers.offered}{' '}
            {dict.components.productCard.offers.promoCode({
              code: availablePromoCode.code,
            })}
          </p>
          <p className="text-sm font-light text-slate-600">
            {dict.components.productCard.offers.promoCodeExplanation({
              code: availablePromoCode.code,
            })}
          </p>
        </div>
      )}
    </div>
  );
};

export default Offers;
