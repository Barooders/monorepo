'use client';
import Loader from '@/components/atoms/Loader';
/* eslint-disable @next/next/no-img-element */
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import Input from '@/components/molecules/FormInput';
import useBackend from '@/hooks/useBackend';
import useFlag from '@/hooks/useFlag';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const dict = getDictionary('fr');
const roundedCard = 'mt-4 rounded-lg border border-zinc-200';

type PropsType = {
  fulfillmentOrderId: string;
};

type HelperPropsType = {
  callback: (trackingId: string) => void;
};

type HelperURLInput = {
  trackingId: string;
};

type TrackinURLInput = {
  fulfillmentOrderId: string;
  trackingUrl: string;
};

const TrackingURLHelperForm: React.FC<HelperPropsType> = ({ callback }) => {
  const formMethods = useForm<HelperURLInput>();

  const onSubmit: SubmitHandler<HelperURLInput> = async ({ trackingId }) => {
    callback(trackingId);
  };

  return (
    <div>
      <FormProvider {...formMethods}>
        <form onSubmit={formMethods.handleSubmit(onSubmit)}>
          <h2 className="text-xl font-semibold">
            {dict.account.order.shipping.helper.title}
          </h2>
          <Input
            label={dict.account.order.shipping.helper.input}
            name="trackingId"
            type="text"
            className="mt-2 font-semibold"
            options={{
              required: dict.global.forms.required,
              validate: (value) =>
                !value.includes(' ') ||
                dict.account.order.shipping.errors.valueCantHaveSpaces,
            }}
          />
          <Button
            type="submit"
            className="mt-2 px-3 py-2.5 text-sm font-medium"
            intent="secondary"
          >
            {dict.account.order.shipping.helper.actions.confirm}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
};

const TrackingURLForm: React.FC<PropsType> = ({ fulfillmentOrderId }) => {
  const showTrackingFeature = useFlag('order-page.tracking-data');
  const { fetchAPI } = useBackend();
  const formMethods = useForm<TrackinURLInput>({
    defaultValues: {
      fulfillmentOrderId,
    },
  });

  const [{ loading: isFulfilling }, doFulfill] =
    useWrappedAsyncFn<
      (fulfillmentOrderId: string, trackingUrl: string) => Promise<void>
    >(async (fulfillmentOrderId, trackingUrl) => {
      const toastOptions = { duration: 3000 };
      try {
        await fetchAPI(`/v1/fulfillment-orders/${fulfillmentOrderId}/fulfill`, {
          method: 'POST',
          body: JSON.stringify({
            trackingUrl,
          }),
        });
        toast.success(
          dict.account.order.shipping.fulfillment.success,
          toastOptions,
        );
      } catch (error) {
        toast.error(dict.account.order.shipping.errors.generic, toastOptions);
      }
    });

  const onSubmit: SubmitHandler<TrackinURLInput> = async ({
    fulfillmentOrderId,
    trackingUrl,
  }) => {
   doFulfill(fulfillmentOrderId, trackingUrl);
  };

  if (!showTrackingFeature) return <></>;

  return (
    <div className={`${roundedCard} p-4`}>
      <p className="mb-2 text-xl font-semibold">
        {dict.account.order.shipping.title}
      </p>
      <span className="text-gray-400">
        {dict.account.order.shipping.description}
      </span>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="w-1/2"
        >
          <Input
            label="fulfillmentOrderId"
            name="fulfillmentOrderId"
            type="text"
            className="hidden"
          />
          <Input
            label={dict.account.order.shipping.trackingUrl}
            name="trackingUrl"
            options={{
              required: dict.global.forms.required,
              validate: (value) =>
                !value.includes(' ') ||
                dict.account.order.shipping.errors.valueCantHaveSpaces,
            }}
            type="url"
            className="mt-5"
            placeholder="https://trace.dpd.fr/fr/trace/12345"
          />
          <Button
            type="submit"
            className="mt-2 w-[300px] px-3 py-2.5 text-sm font-medium"
            intent="secondary"
          >
            {isFulfilling ? (
              <Loader />
            ) : (
              dict.account.order.shipping.actions.confirm
            )}
          </Button>
        </form>
      </FormProvider>
      <Modal
        ButtonComponent={({ openModal }) => (
          <Button
            intent="tertiary"
            className="mt-2 w-[300px] px-3 py-2.5 text-sm font-medium"
            onClick={openModal}
          >
            {dict.account.order.shipping.noTrackingUrl}
          </Button>
        )}
        ContentComponent={({ closeModal }) => (
          <TrackingURLHelperForm
            callback={(trackingId) => {
              formMethods.setValue(
                'trackingUrl',
                `https://parcelsapp.com/fr/tracking/${trackingId}`,
              );
              closeModal();
            }}
          />
        )}
      />
    </div>
  );
};

export default TrackingURLForm;
