import Link from '../Link';

export type PropsType = {
  children?: React.ReactNode;
  className?: string;
  type?: 'submit' | 'button';
  intent?: 'primary' | 'secondary' | 'tertiary';
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
  const intentStyle =
    intent === 'primary'
      ? `text-white ${
          disabled ? 'bg-gray-200' : 'border-primary-600 bg-primary-600'
        }`
      : intent === 'secondary'
      ? `text-white ${disabled ? 'bg-gray-200' : 'border-black bg-black'}`
      : intent === 'tertiary'
      ? `bg-white ${disabled ? 'text-gray-200' : 'border-black text-black'}`
      : '';

  const sizeStyle =
    size === 'medium' ? 'py-2 px-4 text-base' : 'py-1 px-2 text-sm';

  const ButtonTag = href ? Link : 'button';

  return (
    <ButtonTag
      type={type}
      disabled={disabled}
      className={`rounded-md border ${intentStyle} ${sizeStyle} text-center ${
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
