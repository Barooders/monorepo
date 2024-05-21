'use client';

import NoSSR from '@/components/atoms/NoSSR';
import Chat from '@/components/pages/Chat';
import useSearchParams from '@/hooks/useSearchParams';

const ChatPage: React.FC = () => {
  const productInternalId = useSearchParams('product') ?? undefined;
  const selectedConversationId = useSearchParams('conversationId') ?? undefined;

  return (
    <NoSSR>
      <Chat
        productInternalId={productInternalId}
        selectedConversationId={selectedConversationId}
      />
    </NoSSR>
  );
};

export default ChatPage;
