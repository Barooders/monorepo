import Footer from '@/components/molecules/Footer';
import Header from '@/components/molecules/Header';
import {
  INNER_PAGE_BANNER_ANCHOR,
  MODAL_ROOT_ANCHOR,
  SNOWFALL_OVERLAY_ANCHOR,
} from '@/config';
import { poppins } from '@/document/fonts';
import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import GlobalScripts from '@/document/scripts/GlobalScripts';
import WebOnlyScripts from '@/document/scripts/WebOnlyScripts';
import AnalyticsProvider from '@/providers/AnalyticsProvider';
import FeatureFlagsProvider from '@/providers/FeatureFlagsProvider';
import HasuraApolloProvider from '@/providers/HasuraApolloProvider';
import { Toaster } from 'react-hot-toast';
import { MdCheckCircle } from 'react-icons/md';
import NoSSR from '../atoms/NoSSR';
import { MegaMenuChunk } from '../molecules/MegaMenu/shared/types/app/MegaMenu.types';

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export type PropsType = {
  children?: React.ReactNode;
  menu?: MegaMenuChunk;
};

const MainLayout: React.FC<PropsType> = ({ children, menu }) => {
  return (
    <>
      <GlobalScripts />
      <WebOnlyScripts />
      <div className={`${poppins.className}`}>
        <div
          id={SNOWFALL_OVERLAY_ANCHOR}
          className="pointer-events-none fixed z-100 h-full w-full"
        />
        <div id={MODAL_ROOT_ANCHOR} />

        <FeatureFlagsProvider>
          <HasuraApolloProvider>
            <Header megaMenu={menu} />
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
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
