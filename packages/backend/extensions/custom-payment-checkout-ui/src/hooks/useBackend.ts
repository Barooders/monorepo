import { useSettings } from '@shopify/ui-extensions-react/checkout';

const useBackend = () => {
  const settings = useSettings();
  return async <PayloadType>(path: string, config?: RequestInit) => {
    console.log(`Calling ${path} with:`, config);
    const result = await fetch(`${settings.backend_url.toString()}${path}`, {
      ...config,
      headers: {
        'Content-type': 'application/json',
        ...config.headers,
      },
    });

    let payload = null;

    try {
      payload = await result.json();
    } catch (e) {}

    if (!result.ok || payload?.statusCode >= 400)
      throw new Error(
        `Error returned when calling ${path} with message ${payload.message}`,
      );

    return payload as PayloadType;
  };
};

export default useBackend;
