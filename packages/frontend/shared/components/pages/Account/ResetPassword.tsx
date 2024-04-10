'use client';

import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import Input from '@/components/molecules/FormInput';
import useUser from '@/hooks/state/useUser';
import { useResetPassword } from '@/hooks/useResetPassword';
import { getDictionary } from '@/i18n/translate';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  newPassword: string;
};

const ResetPassword = () => {
  const dictionnary = getDictionary('fr');
  const formMethods = useForm<Inputs>();
  const [state, resetPassword] = useResetPassword();
  const dict = getDictionary('fr');

  const { hasuraToken } = useUser();

  const email = hasuraToken?.user.email;
  const onSubmit: SubmitHandler<Inputs> = ({ newPassword }) => {
    resetPassword(newPassword);
  };

  return (
    <PageContainer size="small">
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <h2 className="mb-4 text-2xl font-bold uppercase">
            {dict.security.intro.title}
          </h2>
          <div className="mb-2 min-h-[60px]">
            {state.error && (
              <p className="flex h-full items-center rounded-md border-2 border-rose-600 p-3 text-red-600">
                {dict.global.errors.resetPassword}
              </p>
            )}
          </div>
          {email && (
            <Input
              label={dictionnary.security.inputs.email.label}
              name="email"
              type="email"
              placeholder={email}
              disabled={true}
            />
          )}
          <Input
            label={dictionnary.security.inputs.newPassword.label}
            name="newPassword"
            type="password"
            options={{ required: dictionnary.global.forms.required }}
            placeholder={dictionnary.security.inputs.newPassword.placeholder}
          />
          <Button
            className="flex w-[100px] items-center justify-center self-start"
            type="submit"
          >
            {state.loading ? <Loader /> : dictionnary.security.submit}
          </Button>
        </form>
      </FormProvider>
    </PageContainer>
  );
};

export default ResetPassword;
