'use client';

import envConfig from '@/config/env';
import { QueryClient } from '@tanstack/react-query';
import { MedusaProvider as RawMedusaProvider } from 'medusa-react';

const queryClient = new QueryClient();

const MedusaProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <RawMedusaProvider
      queryClientProviderProps={{ client: queryClient }}
      baseUrl={envConfig.medusa.baseUrl}
    >
      {children}
    </RawMedusaProvider>
  );
};

export default MedusaProvider;
