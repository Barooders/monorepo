'use client';

import Link from '@/components/atoms/Link';
import Loader from '@/components/atoms/Loader';
import { useAuth } from '@/hooks/useAuth';
import useSearchParams from '@/hooks/useSearchParams';
import { getDictionary } from '@/i18n/translate';
import { useEffect, useState } from 'react';

const AuthCallback = () => {
  const labels = getDictionary('fr');
  const { loginWithToken } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const refreshToken = useSearchParams('refreshToken');
  const authError = useSearchParams('error');
  const type = useSearchParams('type');
  const redirectUrl = useSearchParams('return_url');
  const checkout_url = useSearchParams('checkout_url');

  useEffect(() => {
    if (refreshToken)
      try {
        loginWithToken(
          refreshToken,
          redirectUrl ??
            checkout_url ??
            (type === 'passwordReset' ? '/account/reset-password' : '/account'),
        );
      } catch {
        setError(labels.global.errors.invalidRequest);
      }

    if (authError) {
      setError(labels.security.errors.invalidLink);
    }
  }, [refreshToken, authError, type, redirectUrl, checkout_url]);

  return (
    <div className="m-auto flex items-center justify-center p-12 xl:p-60">
      {error ? (
        <div className="flex flex-col items-center gap-3">
          <p>{error}</p>
          <Link
            className="underline"
            href="/account/login"
          >
            Retour au Login
          </Link>
        </div>
      ) : (
        <Loader className="h-16 w-16" />
      )}
    </div>
  );
};

export default AuthCallback;
