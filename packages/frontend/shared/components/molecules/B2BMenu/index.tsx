import { fetchStrapi } from '@/clients/strapi';
import { parseMegaMenu } from '@/components/molecules/MegaMenu/shared/helpers/utils.helper';
import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { StrapiPluginMenu } from '@/types/strapi';
import B2BMenu from './B2BMenu';

export const getB2BMenuData = async () => {
  const data = await fetchStrapi<StrapiPluginMenu>(
    `/menus/13?nested&populate[items][populate][0]=card_image,parent`,
  );
  return parseMegaMenu(data);
};

const B2BMenuWrapper: React.FC<{ menu: MegaMenuChunk }> = ({ menu }) => (
  <>
    <B2BMenu menu={menu} />
  </>
);

export default B2BMenuWrapper;
