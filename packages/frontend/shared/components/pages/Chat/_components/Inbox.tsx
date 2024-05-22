'use client';

import { graphql } from '@/__generated/gql/registered_user';
import { sendOpenNewConversation } from '@/analytics';
import Alert from '@/components/atoms/Alert';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import ChatPanel from '@/components/molecules/ChatPanel/container';
import { useHasura } from '@/hooks/useHasura';
import useStartChatConversation from '@/hooks/useStartChatConversation';
import { getDictionary } from '@/i18n/translate';
import { ConversationType } from '@/types';
import { HtmlPanel, Session, Inbox as TalkJSInbox } from '@talkjs/react';
import first from 'lodash/first';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdRefresh } from 'react-icons/md';
import { useInterval } from 'react-use';
import { ChatConversationMetadata } from 'shared-types';
import Talk from 'talkjs';

type Props = {
  customerId: string;
  customerName: string;
  productInternalId?: string | null;
  initialConversationId?: string;
};

const GET_PRODUCT = /* GraphQL */ /* typed_for_registered_user */ `
  query getProduct($productInternalId: String!) {
    dbt_store_base_product(where: { id: { _eq: $productInternalId } }) {
      shopifyId
      variants(
        limit: 1
        where: { variant: { inventory_quantity: { _gt: 0 } } }
      ) {
        b2cVariant {
          price
        }
      }
    }
  }
`;

const PANEL_INSERT_DELAY = 1000;

const Inbox: React.FC<Props> = ({
  customerId,
  customerName,
  productInternalId = null,
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
  const fetchProduct = useHasura(graphql(GET_PRODUCT));
  const canaryElRef = useRef<HTMLDivElement | null>(null);

  useInterval(() => {
    if (canaryElRef.current?.clientWidth === 0) {
      setReadyForPanel(false);
    }
  }, 1000);

  useEffect(() => {
    if (!readyForPanel) {
      window.setTimeout(() => setReadyForPanel(true), PANEL_INSERT_DELAY);
    }
  }, [readyForPanel]);

  const onConversationSelected = (e: Talk.ConversationSelectedEvent) => {
    if (!e.conversation) return;

    const customData = e.conversation.custom as Omit<
      ChatConversationMetadata,
      'id'
    >;
    setSelectedConversationId(e.conversation.id);
    setConversationData({
      id: e.conversation.id,
      customerInternalId: customData.customerInternalId,
      productInternalId: customData.productInternalId,
      vendorInternalId: customData.vendorInternalId,
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

  const getProduct = useCallback(async (productInternalId: string) => {
    const result = await fetchProduct({
      productInternalId,
    });
    return first(result.dbt_store_base_product);
  }, []);

  const initConversation = useCallback(async () => {
    if (initialConversationId) {
      setSelectedConversationId(initialConversationId);
      return;
    }

    if (productInternalId) {
      try {
        const product = await getProduct(productInternalId);

        if (!product?.shopifyId) {
          throw new Error('Product not found');
        }
        const { conversationId, isNewConversation } =
          await startChatConversation(productInternalId);

        setSelectedConversationId(conversationId);
        if (isNewConversation) {
          sendOpenNewConversation(
            product.shopifyId,
            customerId,
            first(product.variants)?.b2cVariant?.price,
          );
        }
        return;
      } catch (e) {}
    }
  }, [
    customerId,
    initialConversationId,
    productInternalId,
    startChatConversation,
    getProduct,
  ]);

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
                <>
                  <div ref={canaryElRef} />
                  <ChatPanel
                    setPanelHeight={setPanelHeight}
                    conversation={conversationData}
                  />
                </>
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
