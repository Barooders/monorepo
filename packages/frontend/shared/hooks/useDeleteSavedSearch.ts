import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from './useBackend';

const useDeleteSavedSearch = () => {
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(async (savedSearchId: string): Promise<void> => {
    await fetchAPI(`/v1/saved-search/${savedSearchId}`, {
      method: 'DELETE',
    });
  });
};

export default useDeleteSavedSearch;
