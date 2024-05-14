import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import toast from 'react-hot-toast';
import B2BCustomerRequestItemForm, {
  B2BCustomerRequestItemFormInputs,
} from './B2BCustomerRequestItemForm';
import useCreateRequests from './_hooks/useCreateRequests';

type PropsType = {
  onSave: () => void;
  onClose: () => void;
};

type Inputs = {
  requests: B2BCustomerRequestItemFormInputs[];
};

const dict = getDictionary('fr');

const B2BCustomerRequestForm: React.FC<PropsType> = ({ onSave }) => {
  const formMethods = useForm<Inputs>({
    defaultValues: {
      requests: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'requests',
  });

  const [
    { error: createRequestError, value: createRequestSuccess },
    createRequests,
  ] = useCreateRequests();

  useEffect(() => {
    if (createRequestError != null) {
      toast.error(dict.b2b.proPage.customerRequests.errorToaster);
    }
  }, [createRequestError]);

  useEffect(() => {
    if (createRequestSuccess === true) {
      toast.success(dict.b2b.proPage.customerRequests.successToaster);
      onSave();
    }
  }, [createRequestSuccess, onSave]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await createRequests(data.requests);
  };

  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(doSubmit)}
        className="px-3 py-2"
      >
        <p className="text-2xl font-bold">
          {dict.b2b.proPage.customerRequests.title}
        </p>
        <p className="mb-3 mt-3 text-sm text-slate-600">
          {dict.b2b.proPage.customerRequests.description}
        </p>
        {fields.map((item, index) => (
          <B2BCustomerRequestItemForm
            key={index}
            index={index}
            remove={() => remove(index)}
          />
        ))}
        <div className="mt-2 flex justify-between rounded-lg border border-gray-300 px-3 py-2">
          <span className="mr-5 flex items-center text-base font-semibold">
            {dict.b2b.proPage.customerRequests.form.need} {fields.length + 1}
          </span>
          <Button
            onClick={() => append({} as B2BCustomerRequestItemFormInputs)}
            className="w-[50px] shadow-md"
            intent="secondary"
          >
            +
          </Button>
        </div>
        {submitState.error && (
          <p className="text-red-600">{submitState.error.message}</p>
        )}
        <Button
          className="mt-5 flex w-full justify-center py-3 text-sm font-medium uppercase"
          type="submit"
          intent="primary"
        >
          {submitState.loading ? (
            <Loader />
          ) : (
            dict.b2b.proPage.customerRequests.saveButton
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default B2BCustomerRequestForm;
