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
}) => {
  const getIntentStyle = (intent: string) => {
    switch (intent) {
      case 'primary':
        return `text-white ${
          disabled ? 'bg-gray-200' : 'border-primary-600 bg-primary-600'
        }`;
      case 'secondary':
        return `text-white ${disabled ? 'bg-gray-200' : 'border-black bg-black'}`;
      case 'tertiary':
        return 'bg-gray-200 text-gray-500 font-semibold';
      default:
        return '';
    }
  };

  const sizeStyle =
    size === 'medium' ? 'py-2 px-4 text-base' : 'py-1 px-2 text-sm';

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
    >
      {children}
    </ButtonTag>
  );
};

export default Button;
