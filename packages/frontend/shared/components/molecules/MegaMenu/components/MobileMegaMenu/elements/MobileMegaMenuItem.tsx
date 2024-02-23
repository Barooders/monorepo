import { ChevronToRight } from '@/components/molecules/MegaMenu/elements/UI/Icons';
import {
  IconContainer,
  Icon,
} from '@/components/molecules/MegaMenu/elements/UI/Icon';
import Link from '@/components/atoms/Link';
import { Url } from '@/types';

type Props = {
  url?: Url;
  target?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hasChildren: boolean;
};

const MobileMegaMenuItem = ({
  url,
  target,
  onClick,
  children,
  hasChildren,
}: Props) => {
  return (
    <li className="flex hover:bg-slate-100">
      <Link
        className="flex min-h-[50px] w-full items-center justify-between px-5"
        href={hasChildren ? undefined : url}
        target={hasChildren ? undefined : target ?? undefined}
        onClick={onClick}
      >
        {children}
        {hasChildren && (
          <span className="flex">
            <IconContainer
              width="12px"
              height="12px"
            >
              <Icon source={ChevronToRight} />
            </IconContainer>
          </span>
        )}
      </Link>
    </li>
  );
};

export default MobileMegaMenuItem;
