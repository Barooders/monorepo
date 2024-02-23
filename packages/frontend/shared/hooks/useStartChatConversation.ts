import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from './useBackend';

const useStartChatConversation = () => {
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (
      productId,
      customerId = null,
    ): Promise<{
      conversationId: string;
    }> =>
      fetchAPI('/v1/chat/conversation', {
        method: 'POST',
        body: JSON.stringify({
          productId,
          customerId: customerId ?? undefined,
        }),
      }),
  );
};

export default useStartChatConversation;
