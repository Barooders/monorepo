import { fetchAuth } from '@/clients/auth';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { useRouter } from 'next/navigation';
import useUser from './state/useUser';

type ResetPassword = (newPassword: string) => Promise<void>;

export const useResetPassword = () => {
  const { hasuraToken } = useUser.getState();
  const router = useRouter();

  return useWrappedAsyncFn<ResetPassword>(async (newPassword: string) => {
    if (!hasuraToken) throw new Error('Need to be logged in to reset password');

    await fetchAuth<void>(`/user/password`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${hasuraToken.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        newPassword,
      }),
    });

    router.push('/account');
  });
};
