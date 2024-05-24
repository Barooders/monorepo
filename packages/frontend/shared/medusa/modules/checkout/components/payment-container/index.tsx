import { RadioGroup } from '@headlessui/react';
import { InformationCircleSolid } from '@medusajs/icons';
import { PaymentSession } from '@medusajs/medusa';
import { Text, Tooltip, clx } from '@medusajs/ui';
import React from 'react';

import Radio from '@/medusa/modules/common/components/radio';

import PaymentTest from '../payment-test';

type PaymentContainerProps = {
  paymentSession: PaymentSession;
  selectedPaymentOptionId: string | null;
  disabled?: boolean;
  paymentInfoMap: Record<string, { title: string; icon: JSX.Element }>;
};

const PaymentContainer: React.FC<PaymentContainerProps> = ({
  paymentSession,
  selectedPaymentOptionId,
  paymentInfoMap,
  disabled = false,
}) => {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <>
      <RadioGroup.Option
        key={paymentSession.id}
        value={paymentSession.provider_id}
        disabled={disabled}
        className={clx(
          'text-small-regular rounded-rounded hover:shadow-borders-interactive-with-active mb-2 flex cursor-pointer flex-col gap-y-2 border px-8 py-4',
          {
            'border-ui-border-interactive':
              selectedPaymentOptionId === paymentSession.provider_id,
          },
        )}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-x-4">
            <Radio
              checked={selectedPaymentOptionId === paymentSession.provider_id}
            />
            <Text className="text-base-regular">
              {paymentInfoMap[paymentSession.provider_id]?.title ||
                paymentSession.provider_id}
            </Text>
            {process.env.NODE_ENV === 'development' &&
              !Object.hasOwn(paymentInfoMap, paymentSession.provider_id) && (
                <Tooltip
                  content="You can add a user-friendly name and icon for this payment provider in 'src/modules/checkout/components/payment/index.tsx'"
                  className="min-w-fit"
                >
                  <InformationCircleSolid color="var(--fg-muted)" />
                </Tooltip>
              )}

            {paymentSession.provider_id === 'manual' && isDevelopment && (
              <PaymentTest className="small:block hidden" />
            )}
          </div>
          <span className="text-ui-fg-base justify-self-end">
            {paymentInfoMap[paymentSession.provider_id]?.icon}
          </span>
        </div>
        {paymentSession.provider_id === 'manual' && isDevelopment && (
          <PaymentTest className="small:hidden text-[10px]" />
        )}
      </RadioGroup.Option>
    </>
  );
};

export default PaymentContainer;
