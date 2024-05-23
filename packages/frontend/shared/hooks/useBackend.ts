import { FetchConfigType } from '@/clients/base/rest';
import { fetchBackend } from '@/clients/backend';
import { useHasuraToken } from './useHasuraToken';

const useBackend = () => {
  const { getUpToDateHasuraToken } = useHasuraToken();
  const { verifyAccessToken } = useHasuraToken();

  return {
    fetchAPI: async <PayloadType>(path: string, config?: FetchConfigType) => {
      const response = await getUpToDateHasuraToken();
      const accessToken = response?.accessToken;

      const headers = new Headers(config?.headers ?? {});

      headers.append('Content-Type', 'application/json');
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (accessToken) {
        headers.append('Authorization', `Bearer ${accessToken}`);
      }

      try {
        return await fetchBackend<PayloadType>(path, {
          ...config,
          headers,
        });
      } catch (e) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (accessToken) {
          await verifyAccessToken(accessToken);
        }

        throw e;
      }
    },
  };
};

export default useBackend;
