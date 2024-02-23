import { useFlag as defaultUseFlag } from '@unleash/nextjs';
import { useEffect, useState } from 'react';

const useFlag = (key: string): boolean => {
  const [flag, setFlag] = useState<boolean>(false);
  const unleashFlag = defaultUseFlag(key);

  useEffect(() => {
    setFlag(unleashFlag);
  }, []);

  return flag;
};

export default useFlag;
