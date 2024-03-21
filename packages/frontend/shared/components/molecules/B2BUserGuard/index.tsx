'use client';

import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import { useAuth } from '@/hooks/useAuth';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { useEffect, useState } from 'react';

const B2BUserGuard = ({ children }: { children?: React.ReactNode }) => {
  const { isLoggedIn, redirectToLogin } = useIsLoggedIn();
  const { isB2BUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const dict = getDictionary('fr');

  useEffect(() => {
    setLoading(!isLoggedIn);

    if (!isLoggedIn) {
      redirectToLogin();
    }
  }, [isLoggedIn, redirectToLogin]);

  return (
    <>
      {loading ? (
        <PageContainer>
          <Loader className="h-6 w-6 self-center" />
        </PageContainer>
      ) : !isB2BUser() ? (
        <PageContainer>
          <p>{dict.b2b.unauthorizedUser}</p>
        </PageContainer>
      ) : (
        children
      )}
    </>
  );
};

export default B2BUserGuard;
