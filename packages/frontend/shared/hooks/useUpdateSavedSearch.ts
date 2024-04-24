import { operations } from '@/__generated/rest-schema';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from './useBackend';

const useUpdateSavedSearch = () => {
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (
      savedSearchId: string,
      updates: operations['SavedSearchController_updateSavedSearch']['requestBody']['content']['application/json'],
    ): Promise<void> => {
      await fetchAPI(`/v1/saved-search/${savedSearchId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
    },
  );
};

export default useUpdateSavedSearch;
