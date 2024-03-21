import Header from '@/components/molecules/Header';
import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import GlobalScripts from '@/document/scripts/GlobalScripts';
import WebOnlyScripts from '@/document/scripts/WebOnlyScripts';
import Footer from '../molecules/Footer';
import { MegaMenuChunk } from '../molecules/MegaMenu/shared/types/app/MegaMenu.types';
import BaseLayout from './base';

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export type PropsType = {
  children?: React.ReactNode;
  menu?: MegaMenuChunk;
};

const MainLayout: React.FC<PropsType> = ({ children, menu }) => {
  return (
    <>
      <GlobalScripts />
      <WebOnlyScripts />
      <BaseLayout header={<Header megaMenu={menu} />}>{children}</BaseLayout>
      <Footer />
    </>
  );
};

export default MainLayout;
