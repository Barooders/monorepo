import { operations } from '@/__generated/rest-schema';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Input from '@/components/molecules/FormInput';
import TextArea from '@/components/molecules/FormTextArea';
import useOpenedOffersState from '@/components/pages/ProPage/_state/useOpenedOffersState';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { useMemo } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { MdOutlineCheck } from 'react-icons/md';
import ProductsFromSameVendor from '../b2b/ProductsFromSameVendor';
import ProductLabel from './ProductLabel';

const dict = getDictionary('fr');

type Inputs = {
  quantity: number;
  newPrice: number | null;
  description: string;
};

type PropsType = {
  userCanNegociate?: boolean;
  productId: string;
  productName: string;
  totalQuantity: number;
  vendorId: string;
  getBundleUnitPriceFromQuantity: (quantity: number) => number;
  variants: { title: string; quantity: number }[];
  closeModal?: () => void;
  openDetails: (productInternalId: string) => void;
};

export enum Status {
  BEFORE_SEND = 'BEFORE_SEND',
  AFTER_SEND = 'AFTER_SEND',
}

const MakeB2BOfferModal: React.FC<PropsType> = ({
  userCanNegociate = false,
  productId,
  vendorId,
  openDetails,
  productName,
  totalQuantity,
  getBundleUnitPriceFromQuantity,
  variants,
  closeModal,
}) => {
  const { hasOpenedPriceOffer, addOpenedPriceOfferProductId } =
    useOpenedOffersState();
  const { fetchAPI } = useBackend();

  const status = useMemo(
    () =>
      hasOpenedPriceOffer(productId) ? Status.AFTER_SEND : Status.BEFORE_SEND,
    [productId, hasOpenedPriceOffer],
  );

  const formMethods = useForm<Inputs>({
    mode: 'onBlur',
    defaultValues: {
      quantity: 1,
      newPrice: null,
      description: '',
    },
  });

  const watchQuantity = formMethods.watch('quantity');
  const watchNewPrice = formMethods.watch('newPrice');
  const vendorUnitPrice = getBundleUnitPriceFromQuantity(watchQuantity);

  const rules: Record<Status, { label: string }[]> = {
    [Status.BEFORE_SEND]: [
      {
        label: dict.b2b.productCard.makeAnOffer.addManyDetails,
      },
      { label: dict.b2b.productCard.makeAnOffer.changeQuantityToUpdatePrice },
    ],
    [Status.AFTER_SEND]: [
      { label: dict.makeOffer.offerHasBeenSent },
      { label: dict.makeOffer.quickResponse },
    ],
  };

  const onSubmit: SubmitHandler<Inputs> = async ({
    newPrice,
    quantity,
    description,
  }) => {
    const price = userCanNegociate ? newPrice : vendorUnitPrice;

    if (!price) return;

    const priceOfferBody: operations['PriceOfferController_createB2BPriceOfferByBuyer']['requestBody']['content']['application/json'] =
      {
        buyerUnitPriceInCents: Math.floor(price * 100),
        sellerUnitPriceInCents: Math.floor(vendorUnitPrice * 100),
        productId,
        description: `Note client: "${description}"`,
        quantity,
      };

    await fetchAPI('/v1/price-offer/b2b', {
      method: 'POST',
      body: JSON.stringify(priceOfferBody),
    });

    addOpenedPriceOfferProductId(productId);
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
            className="p-2"
          >
            <div className="mb-3">
              <p className="font-bold">{productName}</p>
              {variants.length > 1 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {variants.map(({ title, quantity }) => (
                    <ProductLabel
                      key={title}
                      label={{
                        content: (
                          <>
                            {title} (x {quantity})
                          </>
                        ),
                        color: 'white',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
            <p>
              {dict.b2b.productCard.makeAnOffer.bundlePrice(
                totalQuantity,
                Math.round(
                  getBundleUnitPriceFromQuantity(totalQuantity) * totalQuantity,
                ),
              )}
            </p>
            <div className="mt-4">
              <Input
                className="my-6"
                label={dict.b2b.productCard.makeAnOffer.inputQuantity}
                name="quantity"
                type="number"
                options={{
                  required: dict.global.forms.required,
                  max: {
                    value: totalQuantity,
                    message:
                      dict.b2b.productCard.makeAnOffer.maxQuantityError(
                        totalQuantity,
                      ),
                  },
                }}
              />
              {userCanNegociate && (
                <Input
                  label={dict.b2b.productCard.makeAnOffer.inputUnitPrice}
                  name="newPrice"
                  type="number"
                  options={{
                    required: {
                      value: userCanNegociate,
                      message: dict.global.forms.required,
                    },
                  }}
                  placeholder={dict.makeOffer.newPricePlaceholder}
                />
              )}
            </div>
            <div
              className={`mb-2 grid ${userCanNegociate ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}
            >
              {!!watchQuantity && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-md border bg-slate-100 p-2">
                  <p className="font-bold">
                    {dict.b2b.productCard.makeAnOffer.sellerOffer}
                  </p>
                  <p>
                    {watchQuantity} x {Math.round(vendorUnitPrice)}€
                  </p>
                  <p>
                    {dict.b2b.productCard.makeAnOffer.total}:{' '}
                    {Math.round(watchQuantity * vendorUnitPrice)} €
                  </p>
                </div>
              )}
              {userCanNegociate && !!watchQuantity && !!watchNewPrice && (
                <div className="flex flex-col items-center justify-center gap-2 rounded-md border bg-green-100 p-2">
                  <p className="font-bold">
                    {dict.b2b.productCard.makeAnOffer.yourOffer}
                  </p>
                  <p>
                    {watchQuantity} x {watchNewPrice}€
                  </p>
                  <p>
                    {dict.b2b.productCard.makeAnOffer.total}:{' '}
                    {Math.round(watchQuantity * watchNewPrice)} €
                  </p>
                </div>
              )}
            </div>
            <TextArea
              name="description"
              options={{
                required: dict.global.forms.required,
              }}
              placeholder={dict.b2b.productCard.makeAnOffer.addMoreDetails}
            />
            {submitState.error && (
              <p className="text-red-600">{submitState.error.message}</p>
            )}

            <Button
              intent="secondary"
              type="submit"
              className="mt-2 flex w-full items-center justify-center"
            >
              {submitState.loading ? (
                <Loader />
              ) : userCanNegociate ? (
                dict.makeOffer.send
              ) : (
                dict.b2b.productCard.makeAnOffer.buy
              )}
            </Button>
          </form>
        </FormProvider>
      ) : (
        <>
          <ProductsFromSameVendor
            vendorId={vendorId}
            openDetails={openDetails}
          />
          <div className="flex justify-center gap-2">
            <Button
              onClick={closeModal}
              intent={'secondary'}
              className="text-sm"
            >
              {dict.makeOffer.backToSite}
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default MakeB2BOfferModal;
