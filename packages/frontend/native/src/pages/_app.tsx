import { poppins } from '@/document/fonts';
import '@/document/styles/globals.scss';
import { AppProps } from 'next/app';
import { NextPage } from 'next/types';
import { MODAL_ROOT_ANCHOR } from '@/config';
import UpdateAppModal from '@/components/UpdateAppModal';

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
      <div id={MODAL_ROOT_ANCHOR} />
      <UpdateAppModal />
      <Component {...pageProps} />
    </>
  );
};

export default App;
