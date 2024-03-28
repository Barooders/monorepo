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
    renderIcon: () => <BiSolidCheckShield className="text-xl text-blue-600" />,
  },
  {
    name: 'ratings',
    content: dict.components.productCard.guarantees.ratings,
    renderIcon: () => <FaRegStar className="text-xl text-blue-600" />,
  },
  {
    name: 'securedPayment',
    content: dict.components.productCard.guarantees.securedPayment,
    renderIcon: () => <FaWallet className="text-xl text-blue-600" />,
  },
  {
    name: 'clientService',
    content: dict.components.productCard.guarantees.clientService,
    renderIcon: () => <FaHeadset className="text-xl text-blue-600" />,
  },
];

const B2B_GUARANTEES = [
  {
    name: 'includedShipping',
    content: dict.b2b.proPage.guarantees.includedShipping,
    renderIcon: () => <MdLocalShipping className="text-xl text-blue-600" />,
  },
  {
    name: 'verifiedSellers',
    content: dict.b2b.proPage.guarantees.verifiedSellers,
    renderIcon: () => <BiSolidCheckShield className="text-xl text-blue-600" />,
  },
  {
    name: 'securedPayment',
    content: dict.b2b.proPage.guarantees.securedPayment,
    renderIcon: () => <FaWallet className="text-xl text-blue-600" />,
  },
];

const BaseGuarantees: React.FC<PropsType> = ({ guarantees }) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="hidden justify-between rounded-lg border border-slate-200 p-4 lg:flex">
        {guarantees.map((guarantee) => (
          <div
            className="flex items-center gap-2 text-slate-700"
            key={guarantee.name}
          >
            {guarantee.renderIcon()}
            <p className="text-sm">{guarantee.content()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export const Guarantees: React.FC = () => {
  return <BaseGuarantees guarantees={GUARANTEES} />;
};

export const B2BGuarantees: React.FC = () => {
  return <BaseGuarantees guarantees={B2B_GUARANTEES} />;
};
