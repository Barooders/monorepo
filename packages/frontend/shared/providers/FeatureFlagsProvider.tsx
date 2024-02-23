'use client';

import { FlagProvider } from '@unleash/nextjs';

const FeatureFlagsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <FlagProvider>{children}</FlagProvider>;
};

export default FeatureFlagsProvider;
