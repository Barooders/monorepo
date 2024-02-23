export enum CalloutTypes {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  SUCCESS = 'success',
}

type PropsType = {
  type: CalloutTypes;
  title?: React.ReactNode;
  content?: React.ReactNode;
};

const calloutConfigs = {
  [CalloutTypes.ERROR]: { styles: 'bg-red-50 text-red-800', icon: '❌' },
  [CalloutTypes.SUCCESS]: {
    styles: 'bg-green-50 text-green-800',
    icon: '✅',
  },
  [CalloutTypes.WARNING]: {
    styles: 'bg-yellow-50 text-yellow-600 border-yellow-500',
    icon: '⚠️',
  },
  [CalloutTypes.INFO]: { styles: 'bg-blue-50 text-slate-700', icon: '💡' },
};

const Callout: React.FC<PropsType> = ({ type, title, content }) => {
  const calloutConfig = calloutConfigs[type];

  return (
    <div
      className={`mb-4 flex items-start gap-3 rounded-lg border p-4 ${calloutConfig.styles}`}
      role="alert"
    >
      <div>{calloutConfig.icon}</div>
      <div className="flex flex-col gap-1">
        {title && <span className="font-medium">{title}</span>}
        <span>{content}</span>
      </div>
    </div>
  );
};
export default Callout;
