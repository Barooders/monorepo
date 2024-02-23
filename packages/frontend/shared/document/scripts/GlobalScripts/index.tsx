import config from '@/config/env';
import Script from 'next/script';

const GlobalScripts = () => {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${config.gtag.id}`}
      />
      <Script
        strategy="afterInteractive"
        id="setup-google-script"
        dangerouslySetInnerHTML={{
          __html: `
					window.dataLayer = window.dataLayer || [];
					function gtag() {
						dataLayer.push(arguments);
					}
					gtag('js', new Date());
					gtag('config', '${config.gtag.id}');`,
        }}
      />
    </>
  );
};

export default GlobalScripts;
