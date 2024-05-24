import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDown } from '@medusajs/icons';
import { Address, AddressPayload, Cart } from '@medusajs/medusa';
import { clx } from '@medusajs/ui';
import { omit } from 'lodash';
import { Fragment, useMemo } from 'react';

import compareAddresses from '@/medusa/lib/util/compare-addresses';
import { cartUpdate } from '@/medusa/modules/checkout/actions';
import Radio from '@/medusa/modules/common/components/radio';

type AddressSelectProps = {
  addresses: Address[];
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
};

const AddressSelect = ({ addresses, cart }: AddressSelectProps) => {
  const handleSelect = (id: string) => {
    const savedAddress = addresses.find((a) => a.id === id);
    if (savedAddress) {
      cartUpdate({
        shipping_address: omit(savedAddress, [
          'id',
          'created_at',
          'updated_at',
          'country',
          'deleted_at',
          'metadata',
          'customer_id',
        ]) as AddressPayload,
      });
    }
  };

  const selectedAddress = useMemo(() => {
    return addresses.find((a) => compareAddresses(a, cart?.shipping_address));
  }, [addresses, cart?.shipping_address]);

  return (
    <Listbox
      onChange={handleSelect}
      value={selectedAddress?.id}
    >
      <div className="relative">
        <Listbox.Button
          className="rounded-rounded text-base-regular relative flex w-full cursor-default items-center justify-between border bg-white px-4 py-[10px] text-left focus:outline-none focus-visible:border-gray-300 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-300"
          data-testid="shipping-address-select"
        >
          {({ open }) => (
            <>
              <span className="block truncate">
                {selectedAddress
                  ? selectedAddress.address_1
                  : 'Choose an address'}
              </span>
              <ChevronUpDown
                className={clx('transition-rotate duration-200', {
                  'rotate-180 transform': open,
                })}
              />
            </>
          )}
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="text-small-regular border-top-0 absolute z-20 max-h-60 w-full overflow-auto border bg-white focus:outline-none sm:text-sm"
            data-testid="shipping-address-options"
          >
            {addresses.map((address) => {
              return (
                <Listbox.Option
                  key={address.id}
                  value={address.id}
                  className="relative cursor-default select-none py-4 pl-6 pr-10 hover:bg-gray-50"
                  data-testid="shipping-address-option"
                >
                  <div className="flex items-start gap-x-4">
                    <Radio
                      checked={selectedAddress?.id === address.id}
                      data-testid="shipping-address-radio"
                    />
                    <div className="flex flex-col">
                      <span className="text-base-semi text-left">
                        {address.first_name} {address.last_name}
                      </span>
                      {address.company && (
                        <span className="text-small-regular text-ui-fg-base">
                          {address.company}
                        </span>
                      )}
                      <div className="text-base-regular mt-2 flex flex-col text-left">
                        <span>
                          {address.address_1}
                          {address.address_2 && (
                            <span>, {address.address_2}</span>
                          )}
                        </span>
                        <span>
                          {address.postal_code}, {address.city}
                        </span>
                        <span>{address.country_code?.toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </Listbox.Option>
              );
            })}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default AddressSelect;
