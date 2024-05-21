import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from './useBackend';

const useStartChatConversation = () => {
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (
      productInternalId,
      customerId = null,
    ): Promise<{
      conversationId: string;
      isNewConversation: boolean;
    }> =>
      fetchAPI('/v1/chat/conversation', {
        method: 'POST',
        body: JSON.stringify({
          productInternalId,
          customerId,
        }),
      }),
  );
};

export default useStartChatConversation;
