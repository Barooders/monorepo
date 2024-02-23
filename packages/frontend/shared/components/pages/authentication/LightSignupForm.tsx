'use client';

import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import Input from '@/components/molecules/FormInput';
import { FORBIDDEN_SELLERNAME_REGEX } from '@/hooks/useCheckCustomerIdAvailability';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import useLightSignup from '@/hooks/useLightSignup';
import { getDictionary } from '@/i18n/translate';
import { useRouter } from 'next/navigation';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import { AiFillCheckCircle } from 'react-icons/ai';
import SellerNameInput from './_components/SellerNameInput';

const dict = getDictionary('fr');

type Inputs = {
  firstName: string;
  lastName: string;
  sellerName: string;
  phoneNumber: string;
};

const LightSignupForm = () => {
  const { user } = useHasuraToken();
  const router = useRouter();

  let firstName, lastName;
  if (user?.displayName) {
    [firstName, ...lastName] = user?.displayName.split(' ');
    lastName = lastName.join(' ');
  }

  const formMethods = useForm<Inputs>({
    mode: 'onChange',
    defaultValues: {
      firstName,
      lastName,
      sellerName:
        user?.displayName && FORBIDDEN_SELLERNAME_REGEX.test(user?.displayName)
          ? ''
          : user?.displayName,
    },
  });

  const [state, lightSignup] = useLightSignup();

  if (user === null) {
    router.push('/account/login');
    return null;
  }

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    await lightSignup({
      userId: user.id,
      firstName: data.firstName,
      lastName: data.lastName,
      sellerName: data.sellerName,
      phoneNumber: data.phoneNumber,
    });
  };

  return (
    <PageContainer size="small">
      <h2 className="mx-auto mb-4 mt-3 text-2xl font-bold uppercase">
        {dict.lightSignup.title}
      </h2>
      <p>{dict.lightSignup.description}</p>

      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(onSubmit)}
          className="flex flex-col gap-2"
        >
          <Input
            label={dict.lightSignup.inputs.firstname.label}
            name="firstName"
            options={{ required: dict.global.forms.required }}
            placeholder={dict.lightSignup.inputs.firstname.placeholder}
          />
          <Input
            label={dict.lightSignup.inputs.lastname.label}
            name="lastName"
            options={{ required: dict.global.forms.required }}
            placeholder={dict.lightSignup.inputs.lastname.placeholder}
          />
          <SellerNameInput name="sellerName" />
          <Input
            label={dict.account.myInfo.phoneNumberLabel}
            name="phoneNumber"
            type="tel"
            placeholder="+33 "
          />
          <Button
            className="flex w-[200px] justify-center self-start"
            type="submit"
          >
            {state.loading ? (
              <Loader />
            ) : state.value ? (
              <AiFillCheckCircle fill="white" />
            ) : (
              dict.lightSignup.submit
            )}
          </Button>
          <div className="">
            {state.error && (
              <p className="flex h-full items-center rounded-md border-2 border-rose-600 p-3 text-red-600">
                {dict.global.errors.lightSignup}
              </p>
            )}
          </div>
        </form>
      </FormProvider>
    </PageContainer>
  );
};

export default LightSignupForm;
