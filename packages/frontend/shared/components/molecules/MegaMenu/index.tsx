import MegaMenu from './components/MegaMenu';
import MobileMegaMenu from './components/MobileMegaMenu';
import { parseMegaMenu } from '@/components/molecules/MegaMenu/shared/helpers/utils.helper';
import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { fetchStrapi } from '@/clients/strapi';
import { StrapiPluginMenu } from './shared/types/strapi/plugins/StrapiPluginMenus.types';

export const getMenuData = async () => {
  const data = await fetchStrapi<StrapiPluginMenu>(
    `/menus/1?nested&populate[items][populate][0]=card_image,parent`,
  );
  return parseMegaMenu(data);
};

const MegaMenuWrapper: React.FC<{ megaMenu: MegaMenuChunk }> = ({
  megaMenu,
}) => (
  <>
    <MegaMenu megaMenu={megaMenu} />
    <MobileMegaMenu megaMenu={megaMenu} />
  </>
);

export default MegaMenuWrapper;
