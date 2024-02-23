'use client';

import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import WebOnlyScripts from '@/document/scripts/WebOnlyScripts';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { useEffect, useState } from 'react';

const AuthenticationGuard = ({ children }: { children?: React.ReactNode }) => {
  const { isLoggedIn, redirectToLogin } = useIsLoggedIn();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(!isLoggedIn);
    if (!isLoggedIn) {
      redirectToLogin();
    }
  }, [isLoggedIn]);

  return (
    <>
      <WebOnlyScripts />
      {loading ? (
        <PageContainer>
          <Loader className="h-6 w-6 self-center" />
        </PageContainer>
      ) : (
        children
      )}
    </>
  );
};

export default AuthenticationGuard;
