import { getDictionary } from '@/i18n/translate';
import { BiSolidCheckShield } from 'react-icons/bi';
import { FaRegStar, FaWallet, FaHeadset } from 'react-icons/fa';

const dict = getDictionary('fr');

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

type PropsType = {
  vendor: string | null;
};

const Guarantees: React.FC<PropsType> = () => {
  return (
    <div className="flex flex-col gap-2">
      <div className="hidden justify-between rounded-lg border border-slate-200 p-4 lg:flex">
        {GUARANTEES.map((guarantee) => (
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

export default Guarantees;
