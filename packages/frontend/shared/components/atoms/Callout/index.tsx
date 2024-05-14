import { useState } from 'react';
import { MdClose } from 'react-icons/md';

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
  closable?: boolean;
  onClose?: () => void;
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
  [CalloutTypes.INFO]: { styles: 'bg-blue-50 text-blue-950', icon: '💡' },
};

const Callout: React.FC<PropsType> = ({
  type,
  title,
  content,
  closable,
  onClose,
}) => {
  const calloutConfig = calloutConfigs[type];
  const [isOpen, setIsOpen] = useState(true);
  const close = () => {
    setIsOpen(false);
    if (onClose) onClose();
  };

  if (!isOpen) return <></>;

  return (
    <div
      className={`relative mb-4 flex items-start gap-3 rounded-lg border p-4 ${calloutConfig.styles}`}
      role="alert"
    >
      {closable && (
        <div
          className="absolute right-2 top-2 cursor-pointer p-1"
          onClick={close}
        >
          <MdClose />
        </div>
      )}
      <div>{calloutConfig.icon}</div>
      <div className="flex flex-col gap-1">
        {title && <span className="font-medium">{title}</span>}
        <span>{content}</span>
      </div>
    </div>
  );
};
export default Callout;
