import { getDictionary } from '@/i18n/translate';
import { IconType } from 'react-icons';
import { HiExclamation } from 'react-icons/hi';

const dict = getDictionary('fr');

type PropsType = {
  title?: string;
  description?: string;
  Icon?: IconType;
};

const ErrorPanel: React.FC<PropsType> = ({
  title = dict.global.errors.title,
  description = dict.global.errors.description,
  Icon = HiExclamation,
}) => {
  return (
    <div className="m-auto flex flex-col items-center justify-center p-12 text-center text-slate-800 xl:p-52">
      <Icon className="text-6xl" />
      <h2 className="mb-3 text-3xl font-medium">{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default ErrorPanel;
