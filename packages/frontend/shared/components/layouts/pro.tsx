import { metadataConfig, viewportConfig } from '@/document/metadata/global';
import B2BHeader from '../molecules/B2BHeader';
import BaseLayout from './base';

export const metadata = metadataConfig;
export const viewport = viewportConfig;

export type PropsType = {
  children?: React.ReactNode;
};

const ProLayout: React.FC<PropsType> = ({ children }) => {
  return <BaseLayout header={<B2BHeader />}>{children}</BaseLayout>;
};

export default ProLayout;
