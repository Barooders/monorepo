import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import B2BHeader from '../molecules/B2BHeader';
import { MegaMenuChunk } from '../molecules/MegaMenu/shared/types/app/MegaMenu.types';
import BaseLayout from './base';

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export type PropsType = {
  children?: React.ReactNode;
  menu: MegaMenuChunk;
};

const ProLayout: React.FC<PropsType> = ({ children, menu }) => {
  return <BaseLayout header={<B2BHeader menu={menu} />}>{children}</BaseLayout>;
};

export default ProLayout;
