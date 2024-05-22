import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useBackend from './useBackend';

const useStartChatConversation = () => {
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (
      productInternalId,
    ): Promise<{
      conversationId: string;
      isNewConversation: boolean;
    }> =>
      fetchAPI('/v1/chat/conversation', {
        method: 'POST',
        body: JSON.stringify({
          productInternalId,
        }),
      }),
  );
};

export default useStartChatConversation;
