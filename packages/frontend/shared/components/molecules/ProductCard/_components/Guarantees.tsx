import { getDictionary } from '@/i18n/translate';
import { BiSolidCheckShield } from 'react-icons/bi';
import { FaWallet } from 'react-icons/fa';
import {
  HiMiniMagnifyingGlass,
  HiOutlineArrowUturnLeft,
  HiOutlineStar,
  HiOutlineTag,
} from 'react-icons/hi2';
import { MdLocalShipping } from 'react-icons/md';
import { PiHeadset } from 'react-icons/pi';
import { getSubventionAmount } from '../_utils/offers';
import { AvailableOffers } from '../config';

const dict = getDictionary('fr');

type PropsType = { availableOffers?: AvailableOffers[] };
type GuaranteePropsType = PropsType & {
  guarantees: {
    name: string;
    content: () => React.ReactNode;
    renderIcon: () => React.ReactNode;
    intent?: 'primary';
  }[];
};

const formatFinancialHelp = (amount: number) => ({
  name: 'financialOffer',
  content: () => dict.components.productCard.guarantees.financialOffer(amount),
  renderIcon: () => <HiOutlineStar className="text-xl" />,
  intent: 'primary',
});

const GUARANTEES = [
  {
    name: 'verifiedOffers',
    content: dict.components.productCard.guarantees.verifiedOffers,
    renderIcon: () => <HiMiniMagnifyingGlass className="text-xl" />,
  },
  {
    name: 'freeRefund',
    content: dict.components.productCard.guarantees.freeRefund,
    renderIcon: () => <HiOutlineArrowUturnLeft className="text-xl" />,
  },
  {
    name: 'clientService',
    content: dict.components.productCard.guarantees.clientService,
    renderIcon: () => <PiHeadset className="text-xl" />,
  },
  {
    name: 'sellYourBike',
    content: dict.components.productCard.guarantees.sellYourBike,
    renderIcon: () => <HiOutlineTag className="text-xl" />,
  },
];

const B2B_GUARANTEES = [
  {
    name: 'includedShipping',
    content: dict.b2b.proPage.guarantees.includedShipping,
    renderIcon: () => <MdLocalShipping className="text-xl" />,
  },
  {
    name: 'verifiedSellers',
    content: dict.b2b.proPage.guarantees.verifiedSellers,
    renderIcon: () => <BiSolidCheckShield className="text-xl" />,
  },
  {
    name: 'securedPayment',
    content: dict.b2b.proPage.guarantees.securedPayment,
    renderIcon: () => <FaWallet className="text-xl" />,
  },
];

const BaseGuarantees: React.FC<GuaranteePropsType> = ({ guarantees }) => {
  return (
    <div className="hidden flex-wrap gap-2 lg:flex">
      {guarantees.map((guarantee) => {
        const isPrimary = guarantee.intent === 'primary';
        return (
          <div
            className={`flex items-center gap-2 rounded-full ${isPrimary ? 'bg-primary-400' : 'bg-slate-100'} p-1 pr-3`}
            key={guarantee.name}
          >
            <div className="rounded-full bg-white p-2">
              {guarantee.renderIcon()}
            </div>
            <p className={`text-sm ${isPrimary ? 'text-white' : ''}`}>
              {guarantee.content()}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export const Guarantees: React.FC<PropsType> = ({ availableOffers }) => {
  const subventionAmount = getSubventionAmount(availableOffers ?? []);
  const guarantees = subventionAmount
    ? [formatFinancialHelp(subventionAmount), ...GUARANTEES]
    : GUARANTEES;

  return <BaseGuarantees guarantees={guarantees} />;
};

export const B2BGuarantees: React.FC<PropsType> = () => {
  return <BaseGuarantees guarantees={B2B_GUARANTEES} />;
};
