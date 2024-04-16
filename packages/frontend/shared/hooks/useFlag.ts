import { useFlag as defaultUseFlag } from '@unleash/nextjs';
import { useEffect, useState } from 'react';

const useFlag = (key: string): boolean => {
  const [flag, setFlag] = useState<boolean>(false);
  const unleashFlag = defaultUseFlag(key);

  useEffect(() => {
    setFlag(unleashFlag);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return flag;
};

export default useFlag;
