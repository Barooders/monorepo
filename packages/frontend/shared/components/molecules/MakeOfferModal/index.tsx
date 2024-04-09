import { GetCustomerIdFromShopifyIdQuery } from '@/__generated/graphql';
import { operations } from '@/__generated/rest-schema';
import { sendPriceOffer } from '@/analytics';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Input from '@/components/molecules/FormInput';
import useUser from '@/hooks/state/useUser';
import useBackend from '@/hooks/useBackend';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import first from 'lodash/first';
import { useState } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { MdOutlineCheck } from 'react-icons/md';

const dict = getDictionary('fr');

type Inputs = {
  newPrice: number | null;
};

type PropsType = {
  variantId?: string;
  productId: string;
  originalPrice: number;
  buyerShopifyId?: string;
  negociationMaxAmountPercent: number;
  closeModal?: () => void;
  shouldRedirectToChat?: boolean;
  previousOfferPrice?: number;
};

const GET_CUSTOMER_ID = gql`
  query getCustomerIdFromShopifyId($customerShopifyId: bigint) {
    Customer(where: { shopifyId: { _eq: $customerShopifyId } }) {
      authUserId
    }
  }
`;

export enum Status {
  BEFORE_SEND = 'BEFORE_SEND',
  AFTER_SEND = 'AFTER_SEND',
}

const MakeOfferModal: React.FC<PropsType> = ({
  variantId,
  productId,
  buyerShopifyId,
  originalPrice,
  closeModal,
  negociationMaxAmountPercent,
  shouldRedirectToChat = false,
}) => {
  const [status, setStatus] = useState<Status>(Status.BEFORE_SEND);
  const fetchUserId =
    useHasura<GetCustomerIdFromShopifyIdQuery>(GET_CUSTOMER_ID);
  const getUserId = async (customerShopifyId: string) => {
    const result = await fetchUserId({ customerShopifyId });
    return first(result.Customer)?.authUserId;
  };

  const { hasuraToken } = useUser.getState();
  const { fetchAPI } = useBackend();

  const formMethods = useForm<Inputs>({
    defaultValues: {
      newPrice: null,
    },
  });

  const rules: Record<Status, { label: string }[]> = {
    [Status.BEFORE_SEND]: [
      {
        label: dict.makeOffer.rulePriceExplanation(negociationMaxAmountPercent),
      },
      { label: dict.makeOffer.rulePriceCancel },
      { label: dict.makeOffer.emergency },
    ],
    [Status.AFTER_SEND]: [
      { label: dict.makeOffer.offerHasBeenSent },
      { label: dict.makeOffer.quickResponse },
      { label: dict.makeOffer.emergency },
    ],
  };

  const onSubmit: SubmitHandler<Inputs> = async ({ newPrice }) => {
    if (!newPrice) return;

    const computedBuyerId = buyerShopifyId
      ? await getUserId(buyerShopifyId)
      : hasuraToken?.user.id;

    if (!computedBuyerId) {
      throw new Error(
        `Could not determine buyer id when creating offer on ${productId}`,
      );
    }

    const priceOfferBody: operations['PriceOfferController_createPublicPriceOffer']['requestBody']['content']['application/json'] =
      {
        buyerId: computedBuyerId,
        newPriceInCents: newPrice * 100,
        productId,
        productVariantId: variantId,
      };

    await fetchAPI('/v1/price-offer', {
      method: 'POST',
      body: JSON.stringify(priceOfferBody),
    });

    sendPriceOffer(hasuraToken?.user.id ?? '', productId, variantId);
    setStatus(Status.AFTER_SEND);
  };

  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  return (
    <div className="flex flex-col gap-5 px-7 py-5">
      <p
        className={`text-2xl font-semibold ${
          status === Status.BEFORE_SEND
            ? 'text-secondary-900'
            : 'text-green-700'
        }`}
      >
        {status === Status.AFTER_SEND
          ? dict.makeOffer.offerSentTitle
          : dict.makeOffer.fillYourOfferTitle}
      </p>
      <ul className="flex flex-col gap-1 text-sm text-slate-500">
        {rules[status].map((rule) => (
          <li
            key={rule.label}
            className="flex items-start gap-2"
          >
            <MdOutlineCheck
              className={`h-5w-5 mt-[2px] shrink-0 ${
                status === Status.BEFORE_SEND
                  ? 'text-red-600'
                  : 'text-green-600'
              }`}
            />
            {rule.label}
          </li>
        ))}
      </ul>
      {status === Status.BEFORE_SEND ? (
        <FormProvider {...formMethods}>
          <form
            onSubmit={formMethods.handleSubmit(doSubmit)}
            className="p-3"
          >
            <p className="mb-6">
              {dict.makeOffer.originalPrice(originalPrice)}
            </p>
            <Input
              label={dict.makeOffer.newPriceLabel}
              name="newPrice"
              type="number"
              options={{
                required: dict.global.forms.required,
                max: {
                  value: originalPrice,
                  message: dict.makeOffer.maxPriceError,
                },
                min: {
                  value:
                    originalPrice * (1 - negociationMaxAmountPercent / 100),
                  message: dict.makeOffer.minPriceError(
                    negociationMaxAmountPercent,
                  ),
                },
              }}
              placeholder={dict.makeOffer.newPricePlaceholder}
            />
            {submitState.error && (
              <p className="text-red-600">{submitState.error.message}</p>
            )}

            <Button
              intent="secondary"
              type="submit"
              className="mt-2 flex w-full items-center justify-center"
            >
              {submitState.loading ? <Loader /> : dict.makeOffer.send}
            </Button>
          </form>
        </FormProvider>
      ) : (
        <div className="flex justify-center gap-2">
          {shouldRedirectToChat && (
            <Button
              href="/pages/chat"
              intent="secondary"
            >
              {dict.makeOffer.goToChat}
            </Button>
          )}
          <Button
            onClick={closeModal}
            intent={shouldRedirectToChat ? 'tertiary' : 'secondary'}
          >
            {dict.makeOffer.backToSite}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MakeOfferModal;
