'use client';

import Button from '@/components/atoms/Button';
import Link from '@/components/atoms/Link';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import Input from '@/components/molecules/FormInput';
import SocialLogins from '@/components/molecules/SocialLogins';
import useSignup from '@/hooks/useSignup';
import { getDictionary } from '@/i18n/translate';
import { createRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { AiFillCheckCircle } from 'react-icons/ai';
import SellerNameInput from './_components/SellerNameInput';

const dict = getDictionary('fr');

type Inputs = {
  firstname: string;
  lastname: string;
  sellerName: string;
  email: string;
  password: string;
  phoneNumber: string;
  cguConsent: boolean;
};

const SignupForm = () => {
  const formMethods = useForm<Inputs>({
    mode: 'onChange',
  });
  const [state, signup] = useSignup();
  const recaptchaRef = createRef<ReCAPTCHA>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const recaptchaChallenge = recaptchaRef.current?.getValue();
    signup(
      data.email,
      data.sellerName,
      data.firstname,
      data.lastname,
      data.password,
      data.phoneNumber,
      data.cguConsent,
      recaptchaChallenge ?? '',
    );
  };

  return (
    <PageContainer size="small">
      <h2 className="mx-auto mb-4 mt-3 text-2xl font-bold uppercase">
        {dict.signup.title}
      </h2>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <Input
            label={dict.signup.inputs.firstname.label}
            name="firstname"
            options={{ required: dict.global.forms.required }}
            placeholder={dict.signup.inputs.firstname.placeholder}
          />
          <Input
            label={dict.signup.inputs.lastname.label}
            name="lastname"
            options={{ required: dict.global.forms.required }}
            placeholder={dict.signup.inputs.lastname.placeholder}
          />
          <SellerNameInput name="sellerName" />
          <Input
            label={dict.signup.inputs.email.label}
            name="email"
            type="email"
            options={{ required: dict.global.forms.required }}
            placeholder={dict.signup.inputs.email.placeholder}
          />
          <Input
            label={dict.signup.inputs.password.label}
            name="password"
            type="password"
            options={{ required: dict.global.forms.required }}
          />
          <Input
            label={dict.account.myInfo.phoneNumberLabel}
            name="phoneNumber"
            type="tel"
            placeholder="+33 "
            options={{
              required: dict.global.forms.required,
            }}
          />
          <Input
            name="cguConsent"
            type="checkbox"
            options={{ required: dict.global.forms.required }}
            className="mb-5"
          >
            {dict.signup.inputs.cgu.label()}
          </Input>
          <div className="flex items-center pb-2">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>
          <Button
            className="flex w-[200px] justify-center self-start"
            type="submit"
          >
            {state.loading ? (
              <Loader />
            ) : state.value ? (
              <AiFillCheckCircle fill="white" />
            ) : (
              dict.signup.submit
            )}
          </Button>
          <div className="">
            {state.error && (
              <p className="flex h-full items-center rounded-md border-2 border-rose-600 p-3 text-red-600">
                {dict.global.errors.signup}
                <Link
                  className="underline"
                  href="/account/reset-password"
                >
                  {dict.signup.redirectToLogin}
                </Link>
              </p>
            )}
          </div>
        </form>
      </FormProvider>
      <hr />
      <SocialLogins type="signup" />
      <div className="flex w-full flex-col items-center">
        <p>{dict.signup.alreadyHaveAnAccount}</p>
        <Link
          className="underline"
          href="/account/login"
        >
          {dict.signup.redirectToLogin}
        </Link>
      </div>
    </PageContainer>
  );
};

export default SignupForm;
