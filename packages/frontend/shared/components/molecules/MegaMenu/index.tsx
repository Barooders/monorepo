import { fetchStrapi } from '@/clients/strapi';
import { parseMegaMenu } from '@/components/molecules/MegaMenu/shared/helpers/utils.helper';
import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { StrapiPluginMenu } from '@/types/strapi';
import MegaMenu from './components/MegaMenu';
import MobileMegaMenu from './components/MobileMegaMenu';

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
