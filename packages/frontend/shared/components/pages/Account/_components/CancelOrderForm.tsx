'use client';
import Loader from '@/components/atoms/Loader';
/* eslint-disable @next/next/no-img-element */
import Button from '@/components/atoms/Button';
import Input from '@/components/molecules/FormInput';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const dict = getDictionary('fr');
type PropsType = {
  orderLineId: string;
  closeModal: () => void;
};

type CancelOrderInput = {
  orderLineId: string;
};

const CancelOrderForm: React.FC<PropsType> = ({ orderLineId, closeModal }) => {
  const { fetchAPI } = useBackend();
  const formMethods = useForm<CancelOrderInput>({
    defaultValues: {
      orderLineId,
    },
  });

  const [{ loading: isCancellingOrderLine }, cancelOrderLine] =
    useWrappedAsyncFn<(orderLineId: string) => Promise<void>>(
      async (orderLineId) => {
        const toastOptions = { duration: 3000 };
        try {
          await fetchAPI(`/v1/order-lines/${orderLineId}/cancel`, {
            method: 'POST',
          });
          toast.success(
            dict.account.order.cancel.form.cancelSuccess,
            toastOptions,
          );
        } catch (error) {
          toast.error(dict.account.order.cancel.form.cancelError, toastOptions);
        }
      },
    );

  const onSubmit: SubmitHandler<CancelOrderInput> = async ({ orderLineId }) => {
    cancelOrderLine(orderLineId);
  };

  return (
    <FormProvider {...formMethods}>
      <p className="mb-2 text-xl font-semibold">
        {dict.account.order.cancel.form.title}
      </p>
      <span className="text-gray-400">
        {dict.account.order.cancel.form.description}
      </span>
      <form onSubmit={formMethods.handleSubmit(onSubmit)}>
        <Input
          label="orderLineId"
          name="orderLineId"
          type="text"
          className="hidden"
        />
        {isCancellingOrderLine ? (
          <Loader />
        ) : (
          <>
            <Button
              type="submit"
              className="mt-2 px-3 py-2.5 text-sm font-medium"
              intent="secondary"
            >
              {dict.account.order.cancel.form.actions.confirm}
            </Button>
            <Button
              type="button"
              className="ml-2 mt-2 px-3 py-2.5 text-sm font-medium"
              intent="tertiary"
              onClick={closeModal}
            >
              {dict.account.order.cancel.form.actions.cancel}
            </Button>
          </>
        )}
      </form>
    </FormProvider>
  );
};

export default CancelOrderForm;
