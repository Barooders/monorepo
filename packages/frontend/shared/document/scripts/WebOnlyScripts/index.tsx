import Script from 'next/script';

const WebOnlyScripts = () => (
  <>
    <Script
      id="gorgias-chat-widget-install-v2"
      strategy="afterInteractive"
      src="https://config.gorgias.chat/gorgias-chat-bundle-loader.js?applicationId=13513"
    />
    <Script
      id="gorgias-chat-shopify-install"
      strategy="afterInteractive"
    >
      {`
        !(function (_) {
          (_.SHOPIFY_PERMANENT_DOMAIN = '${process.env.NEXT_PUBLIC_FRONT_DOMAIN}'),
            (_.SHOPIFY_CUSTOMER_ID = ''),
            (_.SHOPIFY_CUSTOMER_EMAIL = '');
        })(window || {});
      `}
    </Script>
    <Script
      id="klaviyo-script-starter"
      strategy="beforeInteractive"
    >
      {`!function(){if(!window.klaviyo){window._klOnsite=window._klOnsite||[];try{window.klaviyo=new Proxy({},{get:function(n,i){return"push"===i?function(){var n;(n=window._klOnsite).push.apply(n,arguments)}:function(){for(var n=arguments.length,o=new Array(n),w=0;w<n;w++)o[w]=arguments[w];var t="function"==typeof o[o.length-1]?o.pop():void 0,e=new Promise((function(n){window._klOnsite.push([i].concat(o,[function(i){t&&t(i),n(i)}]))}));return e}}})}catch(n){window.klaviyo=window.klaviyo||[],window.klaviyo.push=function(){var n;(n=window._klOnsite).push.apply(n,arguments)}}}}();`}
    </Script>
    <Script
      id="klaviyo-script-install"
      strategy="afterInteractive"
      src={`https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_API_KEY}`}
    ></Script>
    <Script
      id="hotjar"
      strategy="afterInteractive"
    >{`(function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:2535522,hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=')
    `}</Script>
    <Script
      id="facebook"
      strategy="afterInteractive"
    >{`
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '319109932988513');
      fbq('track', 'PageView');
    `}</Script>
    <Script
      id="trustpilot-script-install"
      strategy="beforeInteractive"
      src={`//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js`}
    />
    <Script
      id="optinmonster-script-install"
      strategy="afterInteractive"
    >{`
      (function(d,u,ac){
        var s=d.createElement('script');
        s.type='text/javascript';
        s.src='https://a.omappapi.com/app/js/api.min.js';
        s.async=true;
        s.dataset.user=u;
        s.dataset.account=ac;
        d.getElementsByTagName('head')[0].appendChild(s);
      })(document,217770,234096);
      `}</Script>
  </>
);

export default WebOnlyScripts;
