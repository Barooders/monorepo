declare namespace NodeJS {
  export interface ProcessEnv {
    NEXT_PUBLIC_BAROODERS_ENV?: 'production' | 'staging' | 'test' | 'local';
    NEXT_PUBLIC_HASURA_AUTH_BASE_URL: string;
    NEXT_PUBLIC_HASURA_BASE_URL: string;
    NEXT_PUBLIC_SENTRY_DSN: string;
    NEXT_PUBLIC_MIXPANEL_TOKEN: string;
    NEXT_PUBLIC_FRONT_DOMAIN: string;
    NEXT_PUBLIC_DISABLE_APM?: 'disabled';
    NEXT_PUBLIC_BACKEND_API_URL: string;
    NEXT_PUBLIC_SHOP_BASE_URL: string;
    NEXT_PUBLIC_TALK_JS_APP_ID: string;
    NEXT_PUBLIC_STRAPI_URL: string;
    NEXT_PUBLIC_STRAPI_GRAPHQL_URL: string;
    NEXT_PUBLIC_PUBLIC_BUCKET_URL: string;
    NEXT_PUBLIC_UNLEASH_BASE_URL: string;
    NEXT_PUBLIC_UNLEASH_API_TOKEN: string;
    NEXT_PUBLIC_KLAVIYO_API_KEY?: string;
    NEXT_PUBLIC_RECAPTCHA_SITE_KEY: string;
    NEXT_PUBLIC_BUILD_NAME: 'native' | 'web' | 'pwa';
    NEXT_PUBLIC_STOREFRONT_PUBLIC_TOKEN: string;
  }
}

interface Window {
  Trustpilot: {
    loadFromElement: (element: HTMLElement, x: boolean) => void;
  };
  GorgiasChat: {
    open: () => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _klOnsite: any[];
  klaviyo: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    push: (item: any) => void;
    identify: (identity: {
      $email: string;
      $first_name?: string;
      $last_name?: string;
    }) => void;
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dataLayer: any[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  gtag: (...event: any[]) => void;
}

// src/types/photoswipe.d.ts
declare module 'photoswipe/lightbox' {
  import PhotoSwipeLightBox from 'photoswipe/dist/types/lightbox/lightbox';
  export default PhotoSwipeLightBox;
}
