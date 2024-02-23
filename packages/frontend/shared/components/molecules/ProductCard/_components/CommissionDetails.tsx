import { getDictionary } from '@/i18n/translate';
import { BiSolidCheckShield } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';

const dict = getDictionary('fr');

type PropsType = {
  isPro?: boolean;
};

const CommissionDetails: React.FC<PropsType> = ({ isPro }) => {
  const commissionDetails = [
    {
      name: 'verifiedOffers',
      content: dict.components.productCard.commissionDetails.verifiedOffers(),
    },
    {
      name: 'freeRefund',
      content: dict.components.productCard.commissionDetails.freeRefund(
        isPro ? 14 : 4,
      ),
    },
    {
      name: 'securedPayment',
      content: dict.components.productCard.commissionDetails.securedPayment(),
    },
    {
      name: 'clientService',
      content: dict.components.productCard.commissionDetails.clientService(),
    },
  ];

  return (
    <div className=" flex flex-col gap-2 rounded-lg border border-slate-300 p-3">
      <p className="flex items-center gap-2 font-medium uppercase">
        <BiSolidCheckShield />
        {dict.components.productCard.commissionDetails.title}
      </p>
      <div className="flex flex-col gap-2 text-sm text-slate-600">
        {isPro && (
          <p className="font-semibold">
            {dict.components.productCard.commissionDetails.proSubtitle}
          </p>
        )}
        <p>{dict.components.productCard.commissionDetails.description}</p>
        <ul className="flex flex-col gap-1">
          {commissionDetails.map((commissionDetail) => (
            <li
              key={commissionDetail.name}
              className="flex items-center gap-2"
            >
              <>
                <FaCheck className="text-blue-600" />
                {commissionDetail.content}
              </>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CommissionDetails;
