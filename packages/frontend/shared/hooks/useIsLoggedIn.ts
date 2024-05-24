'use client';

import { useEffect, useState } from 'react';
import useUser from './state/useUser';

const useIsLoggedIn = () => {
  const { hasuraToken } = useUser.getState();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(!!hasuraToken);

  useEffect(() => {
    setIsLoggedIn(!!hasuraToken);
  }, [hasuraToken]);

  const redirectToLogin = () => {
    const returnUrl = encodeURIComponent(
      `${window.location.pathname}${window.location.search}`,
    );
    window.location.href = `/account/login?return_url=${returnUrl}`;
  };

  const needsLogin =
    <Args extends unknown[] = [], Response = void>(
      callback: (...args: Args) => Response,
    ) =>
    (...args: Args) => {
      isLoggedIn !== null && !isLoggedIn
        ? redirectToLogin()
        : callback(...args);
    };

  return { isLoggedIn, redirectToLogin, needsLogin };
};

export default useIsLoggedIn;
