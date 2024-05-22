'use client';

import NoSSR from '@/components/atoms/NoSSR';
import Chat from '@/components/pages/Chat';
import useSearchParams from '@/hooks/useSearchParams';

const ChatPage: React.FC = () => {
  const productId = useSearchParams('product') ?? undefined;
  const selectedConversationId = useSearchParams('conversationId') ?? undefined;

  return (
    <NoSSR>
      <Chat
        productId={productId}
        selectedConversationId={selectedConversationId}
      />
    </NoSSR>
  );
};

export default ChatPage;
