'use client';

import { InformationCircleSolid } from '@medusajs/icons';
import { Cart } from '@medusajs/medusa';
import { Heading, Label, Text, Tooltip } from '@medusajs/ui';
import React, { useMemo } from 'react';
import { useFormState } from 'react-dom';

import { formatAmount } from '@/medusa/lib/util/prices';
import {
  removeDiscount,
  removeGiftCard,
  submitDiscountForm,
} from '@/medusa/modules/checkout/actions';
import ErrorMessage from '@/medusa/modules/checkout/components/error-message';
import { SubmitButton } from '@/medusa/modules/checkout/components/submit-button';
import Input from '@/medusa/modules/common/components/input';
import Trash from '@/medusa/modules/common/icons/trash';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type DiscountCodeProps = {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'>;
};

const DiscountCode: React.FC<DiscountCodeProps> = ({ cart }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const { discounts, gift_cards, region } = cart;

  const appliedDiscount = useMemo(() => {
    if (!discounts || !discounts.length) {
      return undefined;
    }

    switch (discounts[0].rule.type) {
      case 'percentage':
        return `${discounts[0].rule.value}%`;
      case 'fixed':
        return `- ${formatAmount({
          amount: discounts[0].rule.value,
          region: region,
        })}`;

      default:
        return dict.discounts.freeShipping;
    }
  }, [discounts, region]);

  const removeGiftCardCode = async (code: string) => {
    await removeGiftCard(code, gift_cards);
  };

  const removeDiscountCode = async () => {
    await removeDiscount(discounts[0].code);
  };

  const [message, formAction] = useFormState(submitDiscountForm, null);

  return (
    <div className="flex w-full flex-col bg-white">
      <div className="txt-medium">
        {gift_cards.length > 0 && (
          <div className="mb-4 flex flex-col">
            <Heading className="txt-medium">
              {dict.checkout.discounts.giftCardsApplied}
            </Heading>
            {gift_cards?.map((gc) => (
              <div
                className="txt-small-plus flex items-center justify-between"
                key={gc.id}
                data-testid="gift-card"
              >
                <Text className="flex items-baseline gap-x-1">
                  <span>{dict.checkout.discounts.code}: </span>
                  <span
                    className="truncate"
                    data-testid="gift-card-code"
                  >
                    {gc.code}
                  </span>
                </Text>
                <Text
                  className="font-semibold"
                  data-testid="gift-card-amount"
                >
                  {formatAmount({
                    region: region,
                    amount: gc.balance,
                    includeTaxes: false,
                  })}
                </Text>
                <button
                  className="!background-transparent flex items-center gap-x-2 !border-none"
                  onClick={() => removeGiftCardCode(gc.code)}
                  data-testid="remove-gift-card-button"
                >
                  <Trash size={14} />
                  <span className="sr-only">
                    {dict.checkout.discounts.removeGiftCards}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}

        {appliedDiscount ? (
          <div className="flex w-full items-center">
            <div className="flex w-full flex-col">
              <Heading className="txt-medium">
                {dict.checkout.discounts.discountsApplied}:
              </Heading>
              <div className="flex w-full max-w-full items-center justify-between">
                <Text className="txt-small-plus flex w-4/5 items-baseline gap-x-1 pr-1">
                  <span>{dict.checkout.discounts.code}:</span>
                  <span className="truncate">{discounts[0].code}</span>
                  <span className="min-w-fit">({appliedDiscount})</span>
                </Text>
                <button
                  className="flex items-center"
                  onClick={removeDiscountCode}
                >
                  <Trash size={14} />
                  <span className="sr-only">
                    {dict.checkout.discounts.removeDiscounts}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form
            action={formAction}
            className="w-full"
          >
            <Label className="my-2 flex items-center gap-x-1">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="txt-medium text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
                data-testid="add-discount-button"
              >
                {dict.checkout.discounts.addDiscountOrGift}
              </button>
              <Tooltip content={dict.checkout.discounts.giftCardExplanation}>
                <InformationCircleSolid color="var(--fg-muted)" />
              </Tooltip>
            </Label>
            {isOpen && (
              <>
                <div className="flex w-full items-center gap-x-2">
                  <Input
                    label="Please enter code"
                    name="code"
                    type="text"
                    autoFocus={false}
                    data-testid="discount-input"
                  />
                  <SubmitButton
                    variant="secondary"
                    data-testid="discount-apply-button"
                  >
                    {dict.checkout.discounts.apply}
                  </SubmitButton>
                </div>
                <ErrorMessage
                  error={message}
                  data-testid="discount-error-message"
                />
              </>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default DiscountCode;
