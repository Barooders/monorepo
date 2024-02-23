import isBrowser from '@/utils/isBrowser';
import mixpanel from 'mixpanel-browser';

const setUtms = () => {
  const utmMedium = new URL(window.location.href).searchParams.get(
    'utm_medium',
  );
  const utmSource = new URL(window.location.href).searchParams.get(
    'utm_source',
  );
  const utmCampaign = new URL(window.location.href).searchParams.get(
    'utm_campaign',
  );

  if (utmMedium || utmSource || utmCampaign) {
    changeUtms(utmSource, utmMedium, utmCampaign);

    return;
  }

  // If no referrer, it is a direct access to the site so we reset utms
  if (!document.referrer) {
    changeUtms(null, null, null);

    return;
  }

  if (
    document.referrer &&
    !document.referrer.startsWith('https://barooders.com')
  ) {
    const referrerUrl = new URL(document.referrer);
    const urlParts = referrerUrl.host.split('.');
    changeUtms(urlParts[urlParts.length - 2], null, null);

    return;
  }
};

export const init = () => {
  if (process.env.NEXT_PUBLIC_MIXPANEL_TOKEN) {
    mixpanel.init(process.env.NEXT_PUBLIC_MIXPANEL_TOKEN, {
      debug: true,
      track_pageview: true,
      persistence: 'cookie',
    });
    if (isBrowser()) {
      setUtms();
    }
  }
};

const changeUtms = (
  source: string | null,
  medium: string | null,
  campaign: string | null,
) => {
  mixpanel.register({
    utm_source: source,
  });
  mixpanel.register({
    utm_medium: medium,
  });
  mixpanel.register({
    utm_campaign: campaign,
  });
};

export const identifyToAnalytics = (userId?: string) =>
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && mixpanel.identify(userId);

export const sendEvent = (name: string, metadata: Record<string, unknown>) =>
  process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && mixpanel.track(name, metadata);
