import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { FormProvider, useForm } from 'react-hook-form';

type PropsType = {
  onSave: () => void;
  onClose: () => void;
};

const dict = getDictionary('fr');

const B2BClientNeedsForm: React.FC<PropsType> = ({ onSave }) => {
  const formMethods = useForm({});

  const onSubmit = async () => {
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
          {dict.b2b.proPage.clientNeeds.title}
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {dict.b2b.proPage.clientNeeds.description}
        </p>
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
            dict.b2b.proPage.clientNeeds.saveButton
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default B2BClientNeedsForm;
