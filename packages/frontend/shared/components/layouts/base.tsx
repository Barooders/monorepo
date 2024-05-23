import {
  INNER_PAGE_BANNER_ANCHOR,
  MODAL_ROOT_ANCHOR,
  SNOWFALL_OVERLAY_ANCHOR,
} from '@/config';
import envConfig from '@/config/env';
import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import AnalyticsProvider from '@/providers/AnalyticsProvider';
import FeatureFlagsProvider from '@/providers/FeatureFlagsProvider';
import HasuraApolloProvider from '@/providers/HasuraApolloProvider';
import { QueryClient } from '@tanstack/react-query';
import { MedusaProvider } from 'medusa-react';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import { MdCheckCircle } from 'react-icons/md';
import NoSSR from '../atoms/NoSSR';

const queryClient = new QueryClient();

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export type PropsType = {
  children: React.ReactNode;
  header: React.ReactNode;
};

const BaseLayout: React.FC<PropsType> = ({ children, header }) => {
  return (
    <div>
      <div
        id={SNOWFALL_OVERLAY_ANCHOR}
        className="pointer-events-none fixed z-100 h-full w-full"
      />
      <div id={MODAL_ROOT_ANCHOR} />
      <FeatureFlagsProvider>
        <HasuraApolloProvider>
          {header}
          <div id={INNER_PAGE_BANNER_ANCHOR} />
          <AnalyticsProvider>
            <MedusaProvider
              queryClientProviderProps={{ client: queryClient }}
              baseUrl={envConfig.medusa.baseUrl}
            >
              {children}
            </MedusaProvider>
          </AnalyticsProvider>
        </HasuraApolloProvider>
      </FeatureFlagsProvider>
      <NoSSR>
        <Toaster
          position="bottom-right"
          reverseOrder={false}
          toastOptions={{
            success: {
              icon: <MdCheckCircle className="text-white" />,
            },
            style: {
              color: '#fff',
              borderRadius: '0px',
              background: '#000',
              width: 'fit-content',
            },
          }}
        />
      </NoSSR>
    </div>
  );
};

export default BaseLayout;
