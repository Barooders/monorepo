'use client';

import { sendOpenNewConversation } from '@/analytics';
import Alert from '@/components/atoms/Alert';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import ChatPanel from '@/components/molecules/ChatPanel/container';
import useStartChatConversation from '@/hooks/useStartChatConversation';
import { getDictionary } from '@/i18n/translate';
import { ConversationType } from '@/types';
import { HtmlPanel, Session, Inbox as TalkJSInbox } from '@talkjs/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdRefresh } from 'react-icons/md';
import Talk from 'talkjs';

type Props = {
  customerId: string;
  customerName: string;
  productId?: string | null;
  initialConversationId?: string;
};

type CustomDataType = {
  customerId: string;
  vendorId: string;
  productId: string;
  productType: string;
};

const PANEL_INSERT_DELAY = 1000;

const Inbox: React.FC<Props> = ({
  customerId,
  customerName,
  productId = null,
  initialConversationId,
}) => {
  const dict = getDictionary('fr');
  const [chatState, startChatConversation] = useStartChatConversation();
  const [talkLoaded, setTalkLoaded] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>();
  const [conversationData, setConversationData] = useState<ConversationType>();
  const inboxEl = useRef<Talk.Inbox>();
  const session = useRef<Talk.Session>();
  const [panelHeight, setPanelHeight] = useState<number>(0);
  const [readyForPanel, setReadyForPanel] = useState(false);
  const [cacheBuster, setCacheBuster] = useState(0);

  useEffect(() => {
    if (!readyForPanel) {
      window.setTimeout(() => setReadyForPanel(true), PANEL_INSERT_DELAY);
    }
  }, [readyForPanel]);

  const onConversationSelected = (e: Talk.ConversationSelectedEvent) => {
    if (!e.conversation) return;

    const customData = e.conversation.custom as CustomDataType;
    setSelectedConversationId(e.conversation.id);
    setConversationData({
      id: e.conversation.id,
      customerId: customData.customerId,
      productId: customData.productId,
      vendorId: customData.vendorId,
    });
  };

  const syncUser = useCallback(
    () =>
      new Talk.User({
        id: customerId,
        name: customerName,
      }),
    [customerId, customerName],
  );

  const initConversation = useCallback(async () => {
    if (initialConversationId) {
      setSelectedConversationId(initialConversationId);
      return;
    }

    if (productId) {
      try {
        const { conversationId, isNewConversation } =
          await startChatConversation(productId, customerId);

        setSelectedConversationId(conversationId);
        if (isNewConversation) sendOpenNewConversation(productId, customerId);
        return;
      } catch (e) {}
    }
  }, [customerId, initialConversationId, productId, startChatConversation]);

  useEffect(() => {
    Talk.ready.then(() => setTalkLoaded(true));
  }, []);

  useEffect(() => {
    if (talkLoaded) {
      initConversation();
    }
  }, [talkLoaded, initConversation]);

  return (
    <div className="flex flex-col items-center gap-3">
      {chatState.loading && <Loader />}
      {chatState?.error && (
        <Alert>
          {chatState?.error?.name === 'CHAT.NEW_CONVERSATION_LIMIT_EXCEEDED'
            ? dict.chat.errors.tooMany
            : dict.chat.errors.unknown}
        </Alert>
      )}
      <Session
        appId={String(process.env.NEXT_PUBLIC_TALK_JS_APP_ID)}
        syncUser={syncUser}
        sessionRef={session}
      >
        <TalkJSInbox
          className="h-[600px] w-full"
          inboxRef={inboxEl}
          conversationId={selectedConversationId}
          onConversationSelected={onConversationSelected}
        >
          {readyForPanel && (
            <HtmlPanel
              url={`/chat-panel.html?${cacheBuster}`}
              height={panelHeight}
            >
              {conversationData ? (
                <ChatPanel
                  setPanelHeight={setPanelHeight}
                  conversation={conversationData}
                  onDetached={() => setReadyForPanel(false)}
                />
              ) : (
                <></>
              )}
            </HtmlPanel>
          )}
        </TalkJSInbox>
      </Session>
      <Button
        intent="tertiary"
        onClick={() => setCacheBuster(cacheBuster + 1)}
      >
        <MdRefresh />
      </Button>
    </div>
  );
};

export default Inbox;
