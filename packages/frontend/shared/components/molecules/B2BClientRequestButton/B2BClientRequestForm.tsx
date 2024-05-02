import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import {
  FormProvider,
  SubmitHandler,
  useFieldArray,
  useForm,
} from 'react-hook-form';
import B2BClientRequestItemForm, {
  B2BClientRequestItemFormInputs,
} from './B2BCLientRequestItemForm';

type PropsType = {
  onSave: () => void;
  onClose: () => void;
};

type Inputs = {
  requests: B2BClientRequestItemFormInputs[];
};

const dict = getDictionary('fr');

const B2BClientRequestForm: React.FC<PropsType> = ({ onSave }) => {
  const formMethods = useForm<Inputs>({
    defaultValues: {
      requests: [{}],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: formMethods.control,
    name: 'requests',
  });

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    console.log(data);

    onSave();
  };

  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(doSubmit)}
        className="p-3"
      >
        <p className="text-2xl font-bold">
          {dict.b2b.proPage.clientRequests.title}
        </p>
        <p className="mb-3 mt-3 text-sm text-slate-600">
          {dict.b2b.proPage.clientRequests.description}
        </p>
        {fields.map((item, index) => (
          <B2BClientRequestItemForm
            key={index}
            index={index}
            remove={() => remove(index)}
          />
        ))}
        <div className="mt-4 flex gap-2 rounded-lg border border-gray-300 px-3 py-2">
          <span className="mr-5 flex items-center text-base font-semibold">
            {dict.b2b.proPage.clientRequests.form.need} {fields.length + 1}
          </span>
          <Button
            onClick={() => append({} as B2BClientRequestItemFormInputs)}
            className="w-[200px] shadow-md"
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
            dict.b2b.proPage.clientRequests.saveButton
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default B2BClientRequestForm;
