import { metadataConfig } from '@/document/metadata/global';
import { getMenuData } from '@/components/molecules/MegaMenu';
import '@/document/styles/globals.scss';
import MainLayout from '@/components/layouts/main';
import { getDictionary } from '@/i18n/translate';
import { poppins } from '@/document/fonts';
import ErrorPanel from '@/components/atoms/ErrorPanel';
import Button from '@/components/atoms/Button';
import { FaRegFaceDizzy } from 'react-icons/fa6';
import { Metadata } from 'next';

const dict = getDictionary('fr');

export const metadata: Metadata = {
  ...metadataConfig,
  title: dict.global.errors.title,
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NotFound() {
  const menu = await getMenuData();
  return (
    <html lang={dict.global.locale}>
      <body className={poppins.className}>
        <MainLayout menu={menu}>
          <div className="flex flex-col items-center justify-center pb-10">
            <ErrorPanel
              Icon={FaRegFaceDizzy}
              title={dict.global.errors.pageNotFound}
            />
            <Button href="/">{dict.global.errors.backToHome}</Button>
          </div>
        </MainLayout>
      </body>
    </html>
  );
}
