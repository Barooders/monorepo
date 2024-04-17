'use client';

import { FetchCustomerQuery } from '@/__generated/graphql';
import Modal from '@/components/atoms/Modal';
import PageContainer from '@/components/atoms/PageContainer';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import { head } from 'lodash';
import { useEffect } from 'react';
import { FaCircleExclamation } from 'react-icons/fa6';
import { HASURA_ROLES } from 'shared-types';
import Inbox from './_components/Inbox';

const dict = getDictionary('fr');

type PropsType = {
  productId?: string;
  selectedConversationId?: string;
};

const GET_CUSTOMER = gql`
  query fetchCustomer {
    Customer {
      chatId
      sellerName
    }
  }
`;

const Chat: React.FC<PropsType> = ({ productId, selectedConversationId }) => {
  const fetchCustomer = useHasura<FetchCustomerQuery>(
    GET_CUSTOMER,
    HASURA_ROLES.ME_AS_CUSTOMER,
  );
  const [customerState, doFetchCustomer] = useWrappedAsyncFn(
    () => fetchCustomer(),
    [fetchCustomer],
  );

  useEffect(() => {
    (async () => {
      doFetchCustomer();
    })();
    doFetchCustomer();
  }, [doFetchCustomer]);

  const customer = head(customerState.value?.Customer);

  if (!customer?.chatId) return <></>;

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
        customerId={customer.chatId}
        customerName={customer.sellerName ?? ''}
        productId={productId}
        initialConversationId={selectedConversationId}
      />
    </PageContainer>
  );
};

export default Chat;
