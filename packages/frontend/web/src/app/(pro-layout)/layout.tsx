import ProLayout from '@/components/layouts/pro';
import { poppins } from '@/document/fonts';
import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import '@/document/styles/globals.scss';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

export const metadata = metadataConfig;
export const viewport = viewportConfig;

const ProLayoutWeb = async ({ children }: { children?: React.ReactNode }) => {
  return (
    <html lang={dict.global.locale}>
      <body className={poppins.className}>
        <ProLayout>{children}</ProLayout>
      </body>
    </html>
  );
};

export default ProLayoutWeb;
