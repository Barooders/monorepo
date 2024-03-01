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
					gtag('config', '${config.gtag.id}');

          gtag("consent", "default", {
            ad_storage: "enabled",
            ad_user_data: "enabled",
            ad_personalization: "enabled",
            analytics_storage: "enabled",
            functionality_storage: "enabled",
            personalization_storage: "enabled",
            security_storage: "granted",
            wait_for_update: 2000,
          });
          gtag("set", "ads_data_redaction", true);
          gtag("set", "url_passthrough", true);`,
        }}
      />
      <Script
        strategy="afterInteractive"
        id="cookieyes"
        src="https://cdn-cookieyes.com/client_data/abcc461482a9ff562819c1e8/script.js"
      />
    </>
  );
};

export default GlobalScripts;
