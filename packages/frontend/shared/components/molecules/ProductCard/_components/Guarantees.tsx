import { getDictionary } from '@/i18n/translate';
import { BiSolidCheckShield } from 'react-icons/bi';
import { FaHeadset, FaRegStar, FaWallet } from 'react-icons/fa';
import { MdLocalShipping } from 'react-icons/md';

const dict = getDictionary('fr');

type PropsType = {
  guarantees: {
    name: string;
    content: () => React.ReactNode;
    renderIcon: () => React.ReactNode;
  }[];
};

const GUARANTEES = [
  {
    name: 'verifiedOffers',
    content: dict.components.productCard.guarantees.verifiedOffers,
    renderIcon: () => <BiSolidCheckShield className="text-xl" />,
  },
  {
    name: 'ratings',
    content: dict.components.productCard.guarantees.ratings,
    renderIcon: () => <FaRegStar className="text-xl" />,
  },
  {
    name: 'securedPayment',
    content: dict.components.productCard.guarantees.securedPayment,
    renderIcon: () => <FaWallet className="text-xl" />,
  },
  {
    name: 'clientService',
    content: dict.components.productCard.guarantees.clientService,
    renderIcon: () => <FaHeadset className="text-xl" />,
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

const BaseGuarantees: React.FC<PropsType> = ({ guarantees }) => {
  return (
    <div className="hidden gap-2 lg:flex">
      {guarantees.map((guarantee) => (
        <div
          className="flex items-center gap-2 rounded-full bg-slate-100 p-2 pr-4"
          key={guarantee.name}
        >
          <div className="rounded-full bg-white p-2">
            {guarantee.renderIcon()}
          </div>
          <p className="text-sm">{guarantee.content()}</p>
        </div>
      ))}
    </div>
  );
};

export const Guarantees: React.FC = () => {
  return <BaseGuarantees guarantees={GUARANTEES} />;
};

export const B2BGuarantees: React.FC = () => {
  return <BaseGuarantees guarantees={B2B_GUARANTEES} />;
};
