import Link from '../Link';

export type PropsType = {
  children?: React.ReactNode;
  className?: string;
  type?: 'submit' | 'button';
  intent?: 'primary' | 'secondary' | 'tertiary' | 'discrete';
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
  size?: 'medium' | 'small';
  target?: string;
};

const Button: React.FC<PropsType> = ({
  children,
  className,
  type,
  intent = 'primary',
  onClick,
  href,
  disabled,
  size = 'medium',
  target,
}) => {
  const disabledStyle = 'bg-gray-200 text-gray-500';
  const getIntentStyle = (intent: string) => {
    switch (intent) {
      case 'primary':
        return `text-white ${
          disabled ? disabledStyle : 'border-primary-600 bg-primary-600'
        }`;
      case 'secondary':
        return `text-white ${disabled ? disabledStyle : 'border-black bg-black'}`;
      case 'tertiary':
        return 'bg-gray-200 text-gray-500 font-semibold';
      default:
        return '';
    }
  };

  const sizeStyle =
    size === 'medium'
      ? 'py-2 px-4 text-sm sm:text-base'
      : 'py-1 px-2 text-xs sm:text-sm';

  const ButtonTag = href ? Link : 'button';

  return (
    <ButtonTag
      type={type}
      disabled={disabled}
      className={`rounded-md border ${getIntentStyle(intent)} ${sizeStyle} text-center ${
        className ?? ''
      }`}
      onClick={onClick}
      href={href}
      target={target}
    >
      {children}
    </ButtonTag>
  );
};

export default Button;
