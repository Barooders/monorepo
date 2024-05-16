import { getDictionary } from '@/i18n/translate';
import { LuArrowRightLeft, LuShieldCheck } from 'react-icons/lu';
import { RiCustomerService2Fill } from 'react-icons/ri';
import { TbCreditCard } from 'react-icons/tb';

const dict = getDictionary('fr');

type GuaranteeProps = {
  icon: React.ReactNode;
  title: string;
};

// TODO: handle overflow
const Guarantee = ({ icon, title }: GuaranteeProps) => {
  return (
    <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-3">
      <div className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#B8D3F7]">
        {icon}
      </div>
      <span className="max-h-[40px] text-sm">{title}</span>
    </div>
  );
};

const ICON_COLOR = '#1B74E4';

const Guarantees = () => {
  return (
    <div className="flex justify-center gap-4">
      <Guarantee
        icon={<LuShieldCheck stroke={ICON_COLOR} />}
        title={dict.homepage.guarantees.verifiedAds}
      />
      <Guarantee
        icon={<LuArrowRightLeft stroke={ICON_COLOR} />}
        title={dict.homepage.guarantees.satisfiedOrRefunded}
      />
      <Guarantee
        icon={
          <RiCustomerService2Fill
            stroke={ICON_COLOR}
            fill={ICON_COLOR}
          />
        }
        title={dict.homepage.guarantees.customerService}
      />
      <Guarantee
        icon={<TbCreditCard stroke={ICON_COLOR} />}
        title={dict.homepage.guarantees.splittedPayment}
      />
    </div>
  );
};

export default Guarantees;
