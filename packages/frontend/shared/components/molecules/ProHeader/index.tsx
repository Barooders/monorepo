import Link from '@/components/atoms/Link';
import BaroodersLogo from '@/components/icons/BaroodersLogo';
import { getDictionary } from '@/i18n/translate';

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

const ProHeader: React.FC = () => {
  const dictionnary = getDictionary('fr');
  return (
    <>
      <header
        id="barooders-pro-header"
        className="sticky top-0 z-30 flex flex-col items-center"
      >
        <HeaderContainer className="py-2 lg:py-4">
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
          </div>
        </HeaderContainer>
      </header>
    </>
  );
};

export default ProHeader;
