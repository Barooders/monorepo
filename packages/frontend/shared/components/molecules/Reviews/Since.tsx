import { getDictionary } from '@/i18n/translate';
import { daysSince } from '@/utils/date';

type PropsType = {
  sinceDate: string;
  className?: string;
};

const dict = getDictionary('fr');

const Since: React.FC<PropsType> = ({ sinceDate, className }) => (
  <div className={`${className}`}>
    {dict.components.trustpilot.since({
      daysCount: daysSince(sinceDate),
    })}
  </div>
);

export default Since;
