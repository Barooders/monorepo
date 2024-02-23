import Link from '@/components/atoms/Link';

type Props = {
  title?: string;
  children?: React.ReactNode;
  type?: 'dark' | 'light';
  className?: string;
  href?: string;
};

const HeaderButton: React.FC<Props> = ({
  title,
  children,
  className,
  type = 'light',
  href,
}) => (
  <Link
    href={href}
    className={`
			${className}
			flex h-[38px] w-[38px] flex-shrink-0
			cursor-pointer items-center justify-center
			rounded-full p-[8px]
			${type === 'light' ? 'hover:bg-gray-300' : ''}
			${type === 'dark' ? 'bg-gray-900' : ''}
		`}
    title={title}
  >
    {children}
  </Link>
);

export default HeaderButton;
