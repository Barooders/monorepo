import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type PropsType = {
  value: boolean | null;
  onChange: (v: boolean) => void;
  className?: string;
  label: string;
};

const YesNoSelector: React.FC<PropsType> = ({
  value,
  onChange,
  className,
  label,
}) => {
  return (
    <div className={`flex items-center ${className}`}>
      <div className="flex cursor-pointer items-center justify-center rounded border border-gray-300 py-1 text-sm text-gray-300">
        <button
          className={`px-2 font-semibold ${
            value ? 'text-primary-400' : 'text-gray-400'
          }`}
          type="button"
          onClick={() => onChange(true)}
        >
          {dict.components.yesNoSelector.yes}
        </button>
        /
        <button
          className={`px-2 font-semibold ${
            !value ? 'text-primary-400' : 'text-gray-400'
          }`}
          type="button"
          onClick={() => onChange(false)}
        >
          {dict.components.yesNoSelector.no}
        </button>
      </div>
      <label
        className="cursor-pointer pl-3"
        onClick={() => onChange(!value)}
      >
        {label}
      </label>
    </div>
  );
};

export default YesNoSelector;
