'use client';

import Loader from '@/components/atoms/Loader';
import InfoModal from '@/components/atoms/Modal/InfoModal';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import { HiOutlineTruck } from 'react-icons/hi2';

const dict = getDictionary('fr');

type DeliveryMethodDefinition = {
  active: boolean;
  description: string;
  id: string;
  name: string;
  methodConditions: {
    conditionCriteria: {
      value: 9;
      __typename: string;
    };
    field: string;
    id: string;
    operator: string;
  }[];
  rateProvider: {
    id: string;
    price: { amount: string };
    __typename: string;
  };
};

type MethodDefinitions = { methodDefinitions: DeliveryMethodDefinition[] };

type PropsType = {
  variantInternalId: string;
  shipmentTimeframeSentence: string | null;
};

const DeliveryInformation: React.FC<PropsType> = ({
  variantInternalId,
  shipmentTimeframeSentence,
}) => {
  const { fetchAPI } = useBackend();
  const [fetchState, doFetch] = useWrappedAsyncFn(
    async (variantInternalId) =>
      (
        await fetchAPI<MethodDefinitions>(
          `/v1/delivery-profile/product-variant/${variantInternalId}`,
        )
      ).methodDefinitions,
  );

  useEffect(() => {
    doFetch(variantInternalId);
  }, [variantInternalId]);

  return (
    <div className="flex justify-start gap-2 rounded-lg border border-slate-300 p-3">
      <HiOutlineTruck className="my-1" />
      <div className="flex w-full flex-col gap-2">
        <p className="flex items-center gap-2 font-medium uppercase">
          {dict.components.productCard.delivery.title}
          {
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            shipmentTimeframeSentence && (
              <span className="ml-2 text-sm font-normal normal-case">
                {shipmentTimeframeSentence}
              </span>
            )
          }
          <InfoModal
            contentComponent={
              <>{dict.components.productCard.delivery.disclaimer}</>
            }
          />
        </p>
        {fetchState.loading ? (
          <Loader />
        ) : fetchState.value ? (
          <ul className="flex flex-col gap-1">
            {fetchState.value.map((deliveryOption) => (
              <li
                className="flex justify-between text-sm text-slate-500"
                key={deliveryOption.id}
              >
                <p>{deliveryOption.name}</p>
                <p className="uppercase">
                  {deliveryOption.rateProvider.price.amount === '0.0'
                    ? dict.components.productCard.free
                    : `${deliveryOption.rateProvider.price.amount}€`}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default DeliveryInformation;
