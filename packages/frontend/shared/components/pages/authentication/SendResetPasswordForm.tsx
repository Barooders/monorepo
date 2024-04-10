'use client';

import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import Input from '@/components/molecules/FormInput';
import { useSendResetPasswordLink } from '@/hooks/useSendResetPasswordLink';

import { getDictionary } from '@/i18n/translate';
import { useRouter } from 'next/navigation';
import { createRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';

type Inputs = {
  email: string;
};

const SendResetPasswordForm = () => {
  const formMethods = useForm<Inputs>();
  const [state, sendResetPasswordLink] = useSendResetPasswordLink();
  const router = useRouter();
  const dict = getDictionary('fr');
  const recaptchaRef = createRef<ReCAPTCHA>();

  const onSubmit: SubmitHandler<Inputs> = ({ email }) => {
    const recaptchaChallenge = recaptchaRef.current?.getValue();
    sendResetPasswordLink(email, recaptchaChallenge ?? '');
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
          <p className="mb-4">{dict.security.intro.description}</p>
          <div className="mb-2 min-h-[60px]">
            {state.error && (
              <div className="flex h-full items-center rounded-md border-2 border-rose-600 p-3 text-red-600">
                {state.error?.name === 'user-not-found' ? (
                  <div className="flex flex-col gap-2">
                    {dict.global.errors.invalidEmail}
                    <Button href="/account/register">
                      {dict.login.signupLink}
                    </Button>
                  </div>
                ) : (
                  dict.global.errors.sendEmail
                )}
              </div>
            )}
            {state.value && (
              <p className="flex h-full items-center rounded-md border-2 border-green-600 p-3 text-green-600">
                {dict.global.success.sendResetPassword}
              </p>
            )}
          </div>
          <Input
            label={dict.security.inputs.email.label}
            name="email"
            type="email"
            disabled={state.value}
            options={{ required: dict.global.forms.required }}
            placeholder={dict.security.inputs.email.placeholder}
          />
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          />
          <div className="flex">
            <Button
              className="flex w-[100px] items-center justify-center self-start"
              type="submit"
              disabled={state.value}
            >
              {state.loading ? <Loader /> : dict.security.submit}
            </Button>
            <Button
              type="button"
              intent="tertiary"
              className="ml-3"
              onClick={() => router.back()}
              disabled={state.value}
            >
              {dict.global.forms.cancel}
            </Button>
          </div>
        </form>
      </FormProvider>
    </PageContainer>
  );
};

export default SendResetPasswordForm;
