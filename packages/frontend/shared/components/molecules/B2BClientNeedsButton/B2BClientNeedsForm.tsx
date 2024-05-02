import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { FormProvider, useForm } from 'react-hook-form';

type PropsType = {
  onSave: () => void;
  onClose: () => void;
};

const B2BClientNeedsForm: React.FC<PropsType> = ({ onSave }) => {
  const formMethods = useForm({});

  const onSubmit = async () => {
    onSave();
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(doSubmit)}
        className="p-3"
      ></form>
    </FormProvider>
  );
};

export default B2BClientNeedsForm;
