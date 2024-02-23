'use client';

import isBrowser from '@/utils/isBrowser';
import { useEffect, useState } from 'react';

const useSearchParams = (key: string): null | string => {
  const [value, setValue] = useState<null | string>(null);
  useEffect(() => {
    setValue(new URL(window.location.href).searchParams.get(key));
  }, [key]);
  if (!isBrowser()) return null;

  return value;
};

export default useSearchParams;
