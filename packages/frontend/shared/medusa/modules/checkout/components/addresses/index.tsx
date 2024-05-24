'use client';

import { CheckCircleSolid } from '@medusajs/icons';
import { Cart, Customer } from '@medusajs/medusa';
import { Heading, Text, useToggleState } from '@medusajs/ui';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';

import Divider from '@/medusa/modules/common/components/divider';
import Spinner from '@/medusa/modules/common/icons/spinner';

import { getDictionary } from '@/i18n/translate';
import compareAddresses from '@/medusa/lib/util/compare-addresses';
import { useFormState } from 'react-dom';
import { setAddresses } from '../../actions';
import BillingAddress from '../billing_address';
import ErrorMessage from '../error-message';
import ShippingAddress from '../shipping-address';
import { SubmitButton } from '../submit-button';

const dict = getDictionary('fr');

const Addresses = ({
  cart,
  customer,
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
  customer: Omit<Customer, 'password_hash'> | null;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const countryCode = params?.countryCode as string;

  const isOpen = searchParams?.get('step') === 'address';

  const { state: sameAsSBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true,
  );

  const handleEdit = () => {
    router.push(pathname + '?step=address');
  };

  const [message, formAction] = useFormState(setAddresses, null);

  return (
    <div className="bg-white">
      <div className="mb-6 flex flex-row items-center justify-between">
        <Heading
          level="h2"
          className="text-3xl-regular flex flex-row items-baseline gap-x-2"
        >
          {dict.checkout.shippingAddress.title}
          {!isOpen && <CheckCircleSolid />}
        </Heading>
        {!isOpen && cart?.shipping_address && (
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-address-button"
            >
              {dict.checkout.edit}
            </button>
          </Text>
        )}
      </div>
      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              countryCode={countryCode}
              checked={sameAsSBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsSBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-3xl-regular gap-x-4 pb-6 pt-8"
                >
                  {dict.checkout.shippingAddress.billingAddress}
                </Heading>

                <BillingAddress
                  cart={cart}
                  countryCode={countryCode}
                />
              </div>
            )}
            <SubmitButton
              className="mt-6"
              data-testid="submit-address-button"
            >
              {dict.checkout.shippingAddress.continueToDelivery}
            </SubmitButton>
            <ErrorMessage
              error={message}
              data-testid="address-error-message"
            />
          </div>
        </form>
      ) : (
        <div>
          <div className="text-small-regular">
            {cart && cart.shipping_address ? (
              <div className="flex items-start gap-x-8">
                <div className="flex w-full items-start gap-x-1">
                  <div
                    className="flex w-1/3 flex-col"
                    data-testid="shipping-address-summary"
                  >
                    <Text className="txt-medium-plus mb-1 text-ui-fg-base">
                      {dict.checkout.shippingAddress.title}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.first_name}{' '}
                      {cart.shipping_address.last_name}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.address_1}{' '}
                      {cart.shipping_address.address_2}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.postal_code},{' '}
                      {cart.shipping_address.city}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.country_code?.toUpperCase()}
                    </Text>
                  </div>

                  <div
                    className="flex w-1/3 flex-col "
                    data-testid="shipping-contact-summary"
                  >
                    <Text className="txt-medium-plus mb-1 text-ui-fg-base">
                      {dict.checkout.shippingAddress.contact}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.shipping_address.phone}
                    </Text>
                    <Text className="txt-medium text-ui-fg-subtle">
                      {cart.email}
                    </Text>
                  </div>

                  <div
                    className="flex w-1/3 flex-col"
                    data-testid="billing-address-summary"
                  >
                    <Text className="txt-medium-plus mb-1 text-ui-fg-base">
                      {dict.checkout.shippingAddress.billingAddress}
                    </Text>

                    {sameAsSBilling ? (
                      <Text className="txt-medium text-ui-fg-subtle">
                        {dict.checkout.shippingAddress.sameBillingAndShipping}
                      </Text>
                    ) : (
                      <>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.first_name}{' '}
                          {cart.billing_address.last_name}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.address_1}{' '}
                          {cart.billing_address.address_2}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.postal_code},{' '}
                          {cart.billing_address.city}
                        </Text>
                        <Text className="txt-medium text-ui-fg-subtle">
                          {cart.billing_address.country_code?.toUpperCase()}
                        </Text>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <Spinner />
              </div>
            )}
          </div>
        </div>
      )}
      <Divider className="mt-8" />
    </div>
  );
};

export default Addresses;
