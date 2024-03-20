import { INNER_PAGE_BANNER_ANCHOR, MODAL_ROOT_ANCHOR } from '@/config';
import { poppins } from '@/document/fonts';
import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import AnalyticsProvider from '@/providers/AnalyticsProvider';
import FeatureFlagsProvider from '@/providers/FeatureFlagsProvider';
import HasuraApolloProvider from '@/providers/HasuraApolloProvider';
import { Toaster } from 'react-hot-toast';
import { MdCheckCircle } from 'react-icons/md';
import NoSSR from '../atoms/NoSSR';
import ProHeader from '../molecules/ProHeader';

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export type PropsType = {
  children?: React.ReactNode;
};

const ProLayout: React.FC<PropsType> = ({ children }) => {
  return (
    <>
      <div className={`${poppins.className}`}>
        <div id={MODAL_ROOT_ANCHOR} />
        <FeatureFlagsProvider>
          <HasuraApolloProvider>
            <ProHeader />
            <div id={INNER_PAGE_BANNER_ANCHOR} />
            <AnalyticsProvider>{children}</AnalyticsProvider>
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
    </>
  );
};

export default ProLayout;
