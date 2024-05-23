import CheckoutForm from '@/medusa/modules/checkout/templates/checkout-form';
import MedusaProvider from '@/providers/MedusaProvider';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return (
    <MedusaProvider>
      <CheckoutForm />
    </MedusaProvider>
  );
}
