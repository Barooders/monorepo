import Checkbox from '@/medusa/modules/common/components/checkbox';
import Input from '@/medusa/modules/common/components/input';
import { Cart, Country, Customer } from '@medusajs/medusa';
import { Container } from '@medusajs/ui';
import React, { useEffect, useMemo, useState } from 'react';
import AddressSelect from '../address-select';
import CountrySelect from '../country-select';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

const ShippingAddress = ({
  customer,
  cart,
  checked,
  onChange,
  countryCode,
}: {
  customer: Omit<Customer, 'password_hash'> | null;
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
  checked: boolean;
  onChange: () => void;
  countryCode: string;
}) => {
  const [formData, setFormData] = useState({
    'shipping_address.first_name': cart?.shipping_address?.first_name || '',
    'shipping_address.last_name': cart?.shipping_address?.last_name || '',
    'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
    'shipping_address.company': cart?.shipping_address?.company || '',
    'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
    'shipping_address.city': cart?.shipping_address?.city || '',
    'shipping_address.country_code':
      cart?.shipping_address?.country_code || countryCode || '',
    email: cart?.email || '',
    'shipping_address.phone': cart?.shipping_address?.phone || '',
  });

  const countriesInRegion = useMemo(
    () => cart?.region.countries.map((c: Country) => c.iso_2),
    [cart?.region],
  );

  // check if customer has saved addresses that are in the current region
  const addressesInRegion = useMemo(
    () =>
      customer?.shipping_addresses.filter(
        (a) => a.country_code && countriesInRegion?.includes(a.country_code),
      ),
    [customer?.shipping_addresses, countriesInRegion],
  );

  useEffect(() => {
    setFormData({
      'shipping_address.first_name': cart?.shipping_address?.first_name || '',
      'shipping_address.last_name': cart?.shipping_address?.last_name || '',
      'shipping_address.address_1': cart?.shipping_address?.address_1 || '',
      'shipping_address.company': cart?.shipping_address?.company || '',
      'shipping_address.postal_code': cart?.shipping_address?.postal_code || '',
      'shipping_address.city': cart?.shipping_address?.city || '',
      'shipping_address.country_code':
        cart?.shipping_address?.country_code || '',
      email: cart?.email || '',
      'shipping_address.phone': cart?.shipping_address?.phone || '',
    });
  }, [cart?.shipping_address, cart?.email]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      {customer && (addressesInRegion?.length || 0) > 0 && (
        <Container className="mb-6 flex flex-col gap-y-4 p-5">
          <p className="text-small-regular">
            {dict.checkout.shippingAddress.welcome(customer.first_name)}
          </p>
          <AddressSelect
            addresses={customer.shipping_addresses}
            cart={cart}
          />
        </Container>
      )}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={dict.checkout.shippingAddress.firstName}
          name="shipping_address.first_name"
          autoComplete="given-name"
          value={formData['shipping_address.first_name']}
          onChange={handleChange}
          required
          data-testid="shipping-first-name-input"
        />
        <Input
          label={dict.checkout.shippingAddress.lastName}
          name="shipping_address.last_name"
          autoComplete="family-name"
          value={formData['shipping_address.last_name']}
          onChange={handleChange}
          required
          data-testid="shipping-last-name-input"
        />
        <Input
          label={dict.checkout.shippingAddress.address}
          name="shipping_address.address_1"
          autoComplete="address-line1"
          value={formData['shipping_address.address_1']}
          onChange={handleChange}
          required
          data-testid="shipping-address-input"
        />
        <Input
          label={dict.checkout.shippingAddress.company}
          name="shipping_address.company"
          value={formData['shipping_address.company']}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="shipping-company-input"
        />
        <Input
          label={dict.checkout.shippingAddress.zipCode}
          name="shipping_address.postal_code"
          autoComplete="postal-code"
          value={formData['shipping_address.postal_code']}
          onChange={handleChange}
          required
          data-testid="shipping-postal-code-input"
        />
        <Input
          label={dict.checkout.shippingAddress.city}
          name="shipping_address.city"
          autoComplete="address-level2"
          value={formData['shipping_address.city']}
          onChange={handleChange}
          required
          data-testid="shipping-city-input"
        />
        <CountrySelect
          name="shipping_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData['shipping_address.country_code']}
          onChange={handleChange}
          required
          data-testid="shipping-country-select"
        />
      </div>
      <div className="my-8">
        <Checkbox
          label={dict.checkout.shippingAddress.useSameBillingAndShipping}
          name="same_as_billing"
          checked={checked}
          onChange={onChange}
          data-testid="billing-address-checkbox"
        />
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <Input
          label="Email"
          name="email"
          type="email"
          title={dict.checkout.shippingAddress.enterAValidAddress}
          autoComplete="email"
          value={formData.email}
          onChange={handleChange}
          required
          data-testid="shipping-email-input"
        />
        <Input
          label={dict.checkout.shippingAddress.phone}
          name="shipping_address.phone"
          autoComplete="tel"
          value={formData['shipping_address.phone']}
          onChange={handleChange}
          required
          data-testid="shipping-phone-input"
        />
      </div>
    </>
  );
};

export default ShippingAddress;
