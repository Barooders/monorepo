import { fetchAuth } from '@/clients/auth';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';

type SendResetPasswordLink = (
  email: string,
  recaptchaChallenge: string,
) => Promise<boolean>;

export const useSendResetPasswordLink = () =>
  useWrappedAsyncFn<SendResetPasswordLink>(
    async (email: string, recaptchaChallenge: string) => {
      await fetchAuth(`/user/password/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          options: {
            redirectTo: `${window.location.origin}/auth-callback`,
          },
          recaptchaChallenge,
        }),
      });

      return true;
    },
  );
