import { metadataConfig } from '@/document/metadata/global';
import { getMenuData } from '@/components/molecules/MegaMenu';
import '@/document/styles/globals.scss';
import MainLayout from '@/components/layouts/main';
import { getDictionary } from '@/i18n/translate';
import { poppins } from '@/document/fonts';

const dict = getDictionary('fr');

export const metadata = metadataConfig;

const MainLayoutWeb = async ({ children }: { children?: React.ReactNode }) => {
  const menu = await getMenuData();
  return (
    <html lang={dict.global.locale}>
      <body className={poppins.className}>
        <MainLayout menu={menu}>{children}</MainLayout>
      </body>
    </html>
  );
};

export default MainLayoutWeb;
