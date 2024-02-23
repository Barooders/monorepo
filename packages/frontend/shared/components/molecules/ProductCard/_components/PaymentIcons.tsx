import { getDictionary } from '@/i18n/translate';
import {
  FaCcApplePay,
  FaCcMastercard,
  FaCcPaypal,
  FaCcVisa,
  FaLock,
} from 'react-icons/fa';

const dict = getDictionary('fr');

const PaymentIcons = () => {
  return (
    <div className="flex w-full items-center justify-center gap-2 text-sm text-slate-400">
      <FaLock className="text-lg" />
      {dict.components.productCard.securedPayment}
      <FaCcMastercard className="text-xl" />
      <FaCcVisa className="text-xl" />
      <FaCcPaypal className="text-xl" />
      <FaCcApplePay className="text-xl" />
    </div>
  );
};

export default PaymentIcons;
