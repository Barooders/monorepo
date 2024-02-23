import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from './useBackend';

const useValidateHandDeliveryOrder = () => {
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (
      orderShopifyId: string,
      conversationId: string,
      hasuraToken: string,
    ): Promise<boolean> => {
      try {
        await fetchAPI('/v1/orders/hand-delivery/status', {
          method: 'POST',
          body: JSON.stringify({
            orderShopifyId,
            conversationId,
          }),
          headers: {
            Authorization: `Bearer ${hasuraToken}`,
          },
        });
      } catch (e) {
        return false;
      }

      return true;
    },
  );
};

export default useValidateHandDeliveryOrder;
