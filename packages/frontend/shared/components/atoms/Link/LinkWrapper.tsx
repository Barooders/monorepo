import { Url } from '@/types';
import Link from '@/components/atoms/Link';

type PropsType = {
  children: React.ReactNode;
  shouldWrap: boolean;
  href?: Url;
  className?: string;
  onClick?: () => void;
};

const LinkWrapper: React.FC<PropsType> = ({
  children,
  shouldWrap,
  href,
  className,
  onClick,
}) => {
  if (shouldWrap) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={className}
      >
        {children}
      </Link>
    );
  }

  return <>{children}</>;
};

export default LinkWrapper;
