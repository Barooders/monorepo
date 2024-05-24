import { getDictionary } from '@/i18n/translate';
import Input from '@/medusa/modules/common/components/input';
import { Cart } from '@medusajs/medusa';
import React, { useEffect, useState } from 'react';
import CountrySelect from '../country-select';

const dict = getDictionary('fr');

const BillingAddress = ({
  cart,
  countryCode,
}: {
  cart: Omit<Cart, 'refundable_amount' | 'refunded_total'> | null;
  countryCode: string;
}) => {
  const [formData, setFormData] = useState({
    'billing_address.first_name': cart?.billing_address?.first_name || '',
    'billing_address.last_name': cart?.billing_address?.last_name || '',
    'billing_address.address_1': cart?.billing_address?.address_1 || '',
    'billing_address.company': cart?.billing_address?.company || '',
    'billing_address.postal_code': cart?.billing_address?.postal_code || '',
    'billing_address.city': cart?.billing_address?.city || '',
    'billing_address.country_code':
      cart?.billing_address?.country_code || countryCode || '',
    'billing_address.phone': cart?.billing_address?.phone || '',
  });

  useEffect(() => {
    setFormData({
      'billing_address.first_name': cart?.billing_address?.first_name || '',
      'billing_address.last_name': cart?.billing_address?.last_name || '',
      'billing_address.address_1': cart?.billing_address?.address_1 || '',
      'billing_address.company': cart?.billing_address?.company || '',
      'billing_address.postal_code': cart?.billing_address?.postal_code || '',
      'billing_address.city': cart?.billing_address?.city || '',
      'billing_address.country_code': cart?.billing_address?.country_code || '',
      'billing_address.phone': cart?.billing_address?.phone || '',
    });
  }, [cart?.billing_address]);

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
      <div className="grid grid-cols-2 gap-4">
        <Input
          label={dict.checkout.shippingAddress.firstName}
          name="billing_address.first_name"
          autoComplete="given-name"
          value={formData['billing_address.first_name']}
          onChange={handleChange}
          required
          data-testid="billing-first-name-input"
        />
        <Input
          label={dict.checkout.shippingAddress.lastName}
          name="billing_address.last_name"
          autoComplete="family-name"
          value={formData['billing_address.last_name']}
          onChange={handleChange}
          required
          data-testid="billing-last-name-input"
        />
        <Input
          label={dict.checkout.shippingAddress.address}
          name="billing_address.address_1"
          autoComplete="address-line1"
          value={formData['billing_address.address_1']}
          onChange={handleChange}
          required
          data-testid="billing-address-input"
        />
        <Input
          label={dict.checkout.shippingAddress.company}
          name="billing_address.company"
          value={formData['billing_address.company']}
          onChange={handleChange}
          autoComplete="organization"
          data-testid="billing-company-input"
        />
        <Input
          label={dict.checkout.shippingAddress.zipCode}
          name="billing_address.postal_code"
          autoComplete="postal-code"
          value={formData['billing_address.postal_code']}
          onChange={handleChange}
          required
          data-testid="billing-postal-input"
        />
        <Input
          label={dict.checkout.shippingAddress.city}
          name="billing_address.city"
          autoComplete="address-level2"
          value={formData['billing_address.city']}
          onChange={handleChange}
          required
          data-testid="billing-city-input"
        />
        <CountrySelect
          name="billing_address.country_code"
          autoComplete="country"
          region={cart?.region}
          value={formData['billing_address.country_code']}
          onChange={handleChange}
          required
          data-testid="billing-country-select"
        />
        <Input
          label={dict.checkout.shippingAddress.phone}
          name="billing_address.phone"
          autoComplete="tel"
          value={formData['billing_address.phone']}
          onChange={handleChange}
          data-testid="billing-phone-input"
        />
      </div>
    </>
  );
};

export default BillingAddress;
