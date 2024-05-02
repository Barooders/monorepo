import { getDictionary } from '@/i18n/translate';
import dayjs from '@/providers/dayjs';
import { HiOutlineClock } from 'react-icons/hi';

const dict = getDictionary('fr');

const Timer = ({ endDate }: { endDate: string | Date }) => (
  <div className="flex items-center gap-1 bg-red-100 px-1 text-xs font-semibold text-red-600">
    <HiOutlineClock
      strokeWidth={3}
      className="text-red-600"
    />
    <span className="hidden sm:inline">
      {dict.components.productCard.price.remaining}
    </span>
    {dayjs(endDate).fromNow(true)}
  </div>
);

export default Timer;
