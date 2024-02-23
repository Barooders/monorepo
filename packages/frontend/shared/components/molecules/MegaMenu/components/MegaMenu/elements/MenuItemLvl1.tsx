import Link from '@/components/atoms/Link';

type Props = {
  title: string;
  url?: string;
  target?: string;
  children?: React.ReactNode;
  mobileHeaderOrder: number;
};

const orderClasses = [
  'order-first',
  'order-1',
  'order-2',
  'order-3',
  'order-4',
  'order-5',
  'order-6',
  'order-7',
  'order-8',
  'order-9',
  'order-10',
  'order-11',
  'order-12',
];

const MenuItemLvl1 = ({
  title,
  url,
  target,
  children,
  mobileHeaderOrder = 0,
}: Props) => {
  return (
    <li
      className={`group shrink-0 flex-col lg:flex ${
        mobileHeaderOrder === 0
          ? 'hidden'
          : `${
              mobileHeaderOrder < 12
                ? orderClasses[mobileHeaderOrder]
                : 'order-last'
            } flex lg:order-none`
      }`}
    >
      <Link
        className="relative z-20 box-border cursor-pointer border-b-2 border-white py-2 px-3 text-sm font-semibold tracking-tight group-hover:border-primary-400 lg:py-1"
        href={url}
        target={target ?? undefined}
      >
        {title}
      </Link>

      <div className="hidden lg:flex">{children}</div>
    </li>
  );
};

export default MenuItemLvl1;
