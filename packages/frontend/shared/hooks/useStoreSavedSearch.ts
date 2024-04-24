import { operations } from '@/__generated/rest-schema';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from './useBackend';

const useStoreSavedSearch = () => {
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (
      savedSearch: operations['SavedSearchController_createSavedSearch']['requestBody']['content']['application/json'],
    ): Promise<string> => {
      return await fetchAPI<
        operations['SavedSearchController_createSavedSearch']['responses']['default']['content']['application/json']
      >('/v1/saved-search', {
        method: 'POST',
        body: JSON.stringify(savedSearch),
      });
    },
  );
};

export default useStoreSavedSearch;
