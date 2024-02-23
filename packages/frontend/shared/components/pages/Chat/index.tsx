'use client';

import Modal from '@/components/atoms/Modal';
import PageContainer from '@/components/atoms/PageContainer';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import { getDictionary } from '@/i18n/translate';
import { FaCircleExclamation } from 'react-icons/fa6';
import Inbox from './_components/Inbox';

const dict = getDictionary('fr');

type PropsType = {
  productId?: string;
  selectedConversationId?: string;
};

const Chat: React.FC<PropsType> = ({ productId, selectedConversationId }) => {
  const { extractTokenInfo } = useHasuraToken();
  const tokenInfo = extractTokenInfo();
  const customerId = String(tokenInfo.shopifyId);
  const customerName = String(tokenInfo.sellerName) ?? '';

  return (
    <PageContainer>
      <div className="flex w-full flex-col items-center gap-3">
        <h1 className="text-center text-3xl">{dict.chat.title}</h1>
        <Modal
          ButtonComponent={({ openModal }) => (
            <button
              onClick={openModal}
              className="flex cursor-pointer items-center gap-2 text-sm font-light text-slate-500 underline"
            >
              <>
                <FaCircleExclamation />
                {dict.chat.warning.button}
              </>
            </button>
          )}
          ContentComponent={dict.chat.warning.content}
        />
      </div>
      <Inbox
        customerId={customerId}
        customerName={customerName}
        productId={productId}
        initialConversationId={selectedConversationId}
      />
    </PageContainer>
  );
};

export default Chat;
