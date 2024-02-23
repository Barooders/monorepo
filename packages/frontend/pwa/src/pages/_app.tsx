import { poppins } from '@/document/fonts';
import '@/document/styles/globals.scss';
import { AppProps } from 'next/app';
import { NextPage } from 'next/types';
import isBrowser from '@/utils/isBrowser';

type AppPropsType = AppProps & {
  Component: NextPage;
};

const App = ({ Component, pageProps }: AppPropsType) => {
  if (!isBrowser()) return null;

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
      <Component {...pageProps} />
    </>
  );
};

export default App;
