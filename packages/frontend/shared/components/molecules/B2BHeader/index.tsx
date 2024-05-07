import Link from '@/components/atoms/Link';
import BaroodersLogo from '@/components/icons/BaroodersLogo';
import { getDictionary } from '@/i18n/translate';
import { FiBell } from 'react-icons/fi';
import B2BMenu from '../B2BMenu';
import B2BSearchBar from '../B2BSearchBar';
import HeaderButton from '../Header/_components/HeaderButton';
import { MegaMenuChunk } from '../MegaMenu/shared/types/app/MegaMenu.types';

const HeaderContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({ children, className, id }) => (
  <div
    id={id}
    className={`relative my-0 flex w-full justify-center border-0 bg-white px-2 lg:px-4 ${className}`}
  >
    <div className="flex w-full max-w-page-content flex-col items-center justify-center">
      {children}
    </div>
  </div>
);

type HeaderProps = {
  menu: MegaMenuChunk;
};

const dict = getDictionary('fr');

const B2BHeader: React.FC<HeaderProps> = ({ menu }) => {
  return (
    <header
      id="barooders-pro-header"
      className="sticky top-0 z-30 flex flex-col items-center"
    >
      <HeaderContainer className="py-2">
        <div className="flex w-full flex-col items-center justify-between gap-2 lg:flex-row lg:gap-5">
          <div
            className="flex w-[225px] flex-shrink-0 items-center"
            title={dict.header.logo.title}
          >
            <Link
              href={'/pro'}
              className="flex h-10 items-center"
            >
              <BaroodersLogo className="fill-red-600" />
            </Link>
          </div>
          <div className="flex h-full w-full flex-grow">
            <B2BSearchBar />
          </div>
          <div className="hidden gap-1 lg:flex">
            <HeaderButton
              href="/account/search-alerts"
              title={dict.header.icons.alerts}
            >
              <FiBell className="h-full w-full" />
            </HeaderButton>
          </div>
          <div className="hidden lg:block">
            <Link
              href="/pro/account"
              className="flex w-48 justify-center rounded-md bg-[#FBFAA5] px-[15px] py-[8px] text-center font-semibold"
            >
              {dict.header.b2b.account}
            </Link>
          </div>
        </div>
      </HeaderContainer>
      <HeaderContainer
        id="barooders-main-menu"
        className="border-gray-2 py-1 lg:border-b lg:py-2"
      >
        <B2BMenu menu={menu} />
      </HeaderContainer>
    </header>
  );
};

export default B2BHeader;
