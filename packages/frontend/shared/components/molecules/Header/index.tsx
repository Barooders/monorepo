import Link from '@/components/atoms/Link';
import SellButton from '@/components/atoms/SellButton';
import BaroodersLogo from '@/components/icons/BaroodersLogo';
import MegaMenu from '@/components/molecules/MegaMenu/components/MegaMenu';
import MobileMegaMenu from '@/components/molecules/MegaMenu/components/MobileMegaMenu';
import { getDictionary } from '@/i18n/translate';
import {
  MdFavoriteBorder,
  MdMailOutline,
  MdOutlineAccountCircle,
} from 'react-icons/md';
import { MegaMenuChunk } from '../MegaMenu/shared/types/app/MegaMenu.types';
import SearchBar from '../SearchBar';
import AnnouncementBar from './_components/AnnouncementBar';
import HeaderButton from './_components/HeaderButton';

type PropsType = {
  megaMenu?: MegaMenuChunk;
};

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

const Header: React.FC<PropsType> = ({ megaMenu }) => {
  const dictionnary = getDictionary('fr');
  return (
    <>
      <AnnouncementBar />
      <header
        id="barooders-main-header"
        className="sticky top-0 z-30 flex flex-col items-center"
      >
        <HeaderContainer className="py-2 lg:py-4">
          <div className="lg:hidden">
            <MobileMegaMenu megaMenu={megaMenu} />
          </div>
          <div className="absolute right-4 top-2 flex lg:hidden">
            <HeaderButton
              href="/account"
              title={dictionnary.header.icons.account}
            >
              <MdOutlineAccountCircle className="h-full w-full fill-secondary-900" />
            </HeaderButton>
          </div>

          <div className="flex w-full flex-col items-center gap-2 lg:flex-row lg:gap-5">
            <div
              className="flex w-[225px] flex-shrink-0 items-center"
              title={dictionnary.header.logo.title}
            >
              <Link
                href={'/'}
                className="flex h-10 items-center"
              >
                <BaroodersLogo className="fill-red-600" />
              </Link>
            </div>

            <div className="flex h-full w-full flex-grow">
              <SearchBar />
            </div>
            <div className="hidden gap-1 lg:flex">
              <HeaderButton
                href="/pages/favoris"
                title={dictionnary.header.icons.favorites}
              >
                <MdFavoriteBorder className="h-full w-full fill-secondary-900" />
              </HeaderButton>
              <HeaderButton
                href="/pages/chat"
                title={dictionnary.header.icons.messages}
              >
                <MdMailOutline className="h-full w-full fill-secondary-900" />
              </HeaderButton>
              <HeaderButton
                href="/account"
                title={dictionnary.header.icons.account}
              >
                <MdOutlineAccountCircle className="h-full w-full fill-secondary-900" />
              </HeaderButton>
            </div>
            <div className="hidden lg:block">
              <SellButton />
            </div>
          </div>
        </HeaderContainer>
        <HeaderContainer
          id="barooders-main-menu"
          className="border-gray-2 py-1 lg:border-b lg:py-2"
        >
          <MegaMenu megaMenu={megaMenu} />
        </HeaderContainer>
      </header>
    </>
  );
};

export default Header;
