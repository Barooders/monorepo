import { poppins } from '@/document/fonts';
import { Metadata } from '@/document/metadata/global';
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import '@/document/styles/globals.scss';
import MainLayout from '@/components/layouts/main';
import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import PageContainer from '@/components/atoms/PageContainer';

type AppPropsType = AppProps & {
  Component: NextPage;
};

const App = ({ Component, pageProps }: AppPropsType) => {
  return (
    <>
      <style
        jsx
        global
      >{`
        html {
          font-family: ${poppins.style.fontFamily};
        }
      `}</style>
      <Metadata />
      <MainLayout menu={pageProps?.searchPageProps?.menuData as MegaMenuChunk}>
        <PageContainer>
          <Component {...pageProps} />
        </PageContainer>
      </MainLayout>
    </>
  );
};

export default App;
