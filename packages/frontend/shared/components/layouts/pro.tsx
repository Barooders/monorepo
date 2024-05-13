import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import ProHeader from '../molecules/ProHeader';
import BaseLayout from './base';

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export type PropsType = {
  children?: React.ReactNode;
};

const ProLayout: React.FC<PropsType> = ({ children }) => {
  return <BaseLayout header={<ProHeader />}>{children}</BaseLayout>;
};

export default ProLayout;
