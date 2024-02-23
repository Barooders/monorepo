import MainLayout from '@/components/layouts/main';
import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { Outlet, ScrollRestoration } from 'react-router-dom';

type PropsType = {
  menu: MegaMenuChunk;
};

const Root: React.FC<PropsType> = ({ menu }) => {
  return (
    <MainLayout menu={menu}>
      <ScrollRestoration getKey={() => location.hash} />
      <Outlet />
    </MainLayout>
  );
};

export default Root;
