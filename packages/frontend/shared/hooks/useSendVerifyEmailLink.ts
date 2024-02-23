import { fetchAuth } from '@/clients/auth';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';

type SendVerifyEmailLink = (email: string) => Promise<boolean>;

export const useSendVerifyEmailLink = () =>
  useWrappedAsyncFn<SendVerifyEmailLink>(async (email: string) => {
    await fetchAuth<void>(`/user/email/send-verification-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
        },
      }),
    });

    return true;
  });
