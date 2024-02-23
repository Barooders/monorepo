'use client';

import Button from '@/components/atoms/Button';
import Input from '@/components/molecules/FormInput';
import Loader from '@/components/atoms/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useSendVerifyEmailLink } from '@/hooks/useSendVerifyEmailLink';
import useSentry from '@/hooks/useSentry';
import { getDictionary } from '@/i18n/translate';
import { createRef } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import ReCAPTCHA from 'react-google-recaptcha';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';

type Inputs = {
  email: string;
  password: string;
};

enum LoginErrorsTypes {
  UNVERIFIED_USER = 'unverified-user',
  INVALID_EMAIL_PASSWORD = 'invalid-email-password',
}

const dictionnary = getDictionary('fr');

const LoginForm = () => {
  const formMethods = useForm<Inputs>();
  const { loginWithPassword } = useAuth();
  const [state, sendVerifyEmailLink] = useSendVerifyEmailLink();
  const Sentry = useSentry();
  const recaptchaRef = createRef<ReCAPTCHA>();
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const recaptchaChallenge = recaptchaRef.current?.getValue();
      const searchParams = new URLSearchParams(window.location.search);

      await loginWithPassword(
        data.email,
        data.password,
        recaptchaChallenge ?? '',
        searchParams.get('return_url') ??
          searchParams.get('checkout_url') ??
          undefined,
      );
    } catch (e: unknown) {
      const loginError = e as { name: string; message: string };
      if (!(loginError.name in LoginErrorsTypes)) {
        console.error(e);
        Sentry.captureException(e);
      }
      throw e;
    }
  };
  const [submitState, doSubmit] = useWrappedAsyncFn(
    onSubmit,
    [recaptchaRef, loginWithPassword],
    { ignoreErrors: true },
  );

  return (
    <>
      <div className="mb-2">
        {submitState.error && (
          <p className="flex h-full items-center rounded-md border-2 border-rose-600 px-4 py-3 text-red-600">
            {{
              [LoginErrorsTypes.UNVERIFIED_USER]: (
                <span>
                  {dictionnary.login.errors.unverifiedUser}
                  <Button
                    className={`mt-2 w-full ${
                      state.value ? 'text-green-600' : 'text-red-600'
                    } flex justify-center text-center`}
                    intent="tertiary"
                    disabled={state.loading || state.value}
                    onClick={() =>
                      sendVerifyEmailLink(formMethods.getValues().email)
                    }
                  >
                    {state.value ? (
                      dictionnary.global.success.sentEmail
                    ) : state.loading ? (
                      <Loader />
                    ) : (
                      dictionnary.login.sendVerifyEmailLink
                    )}
                  </Button>
                </span>
              ),
              [LoginErrorsTypes.INVALID_EMAIL_PASSWORD]:
                dictionnary.login.errors.incorrectLoginOrPassword,
            }[submitState.error.name] ?? dictionnary.global.errors.unknownError}
          </p>
        )}
      </div>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(doSubmit)}
          className="flex flex-col gap-2"
        >
          <Input
            label={dictionnary.login.inputs.email.label}
            name="email"
            type="email"
            options={{ required: dictionnary.global.forms.required }}
            placeholder={dictionnary.login.inputs.email.placeholder}
          />
          <Input
            label={dictionnary.login.inputs.password.label}
            name="password"
            type="password"
            options={{ required: dictionnary.global.forms.required }}
            placeholder={dictionnary.login.inputs.password.placeholder}
          />
          <div className="flex pb-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>
          <Button
            className="flex w-[100px] justify-center self-start"
            type="submit"
          >
            {submitState.loading ? <Loader /> : dictionnary.login.submit}
          </Button>
        </form>
      </FormProvider>
    </>
  );
};

export default LoginForm;
