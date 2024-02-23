import { sendCreateAccount } from '@/analytics';
import { fetchAuth } from '@/clients/auth';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { useRouter } from 'next/navigation';

type SignupFunction = (
  email: string,
  displayName: string,
  firstName: string,
  lastName: string,
  password: string,
  phoneNumber: string,
  cguConsent: boolean,
  recaptchaChallenge: string,
) => Promise<void>;

const useSignup = () => {
  const router = useRouter();

  return useWrappedAsyncFn<SignupFunction>(
    async (
      email: string,
      displayName: string,
      firstName: string,
      lastName: string,
      password: string,
      phoneNumber: string,
      cguConsent: boolean,
      recaptchaChallenge: string,
    ) => {
      await fetchAuth<void>(`/signup/email-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          options: {
            displayName,
            locale: 'fr',
            metadata: {
              firstName,
              lastName,
              cguConsent,
            },
            phoneNumber,
            redirectTo: `${window.location.origin}/auth-callback`,
          },
          password,
          recaptchaChallenge,
        }),
      });

      sendCreateAccount(displayName);
      router.push('/account/login');
    },
  );
};

export default useSignup;
