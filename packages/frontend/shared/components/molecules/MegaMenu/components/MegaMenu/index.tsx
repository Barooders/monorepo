import SkeletonDisplayText from '@/components/molecules/MegaMenu/elements/UI/Skeleton';

import MegaMenuPanel from './elements/MegaMenuPanel';
import MenuItemLvl1 from './elements/MenuItemLvl1';

import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import MegaMenuPanelContent from './elements/MegaMenuPanelContent';
import MegaMenuBackbone from './elements/MegaMenuBackbone';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type Props = {
  megaMenu?: MegaMenuChunk;
};

const MegaMenu = ({ megaMenu }: Props) => {
  return (
    <>
      {/* Desktop navigation */}
      <nav
        role="navigation"
        className="relative z-20 m-0 flex w-full"
      >
        <ul className="scrollbar-hidden m-0 flex w-full overflow-x-auto bg-white">
          {megaMenu ? (
            <>
              <MenuItemLvl1
                title={dict.header.menu.backbone}
                mobileHeaderOrder={0}
              >
                <MegaMenuPanel>
                  <MegaMenuBackbone
                    items={megaMenu.items.filter((item) => item.isBackbone)}
                  />
                </MegaMenuPanel>
              </MenuItemLvl1>
              {megaMenu.items
                .filter((item) => !item.isHiddenInMenu)
                .map((item, i) => (
                  <MenuItemLvl1
                    mobileHeaderOrder={item.mobileHeaderOrder}
                    key={`item_${i}`}
                    title={item.title}
                    url={item.url}
                    target={item.target ?? ''}
                  >
                    {item.children && (
                      <MegaMenuPanel>
                        <MegaMenuPanelContent item={item} />
                      </MegaMenuPanel>
                    )}
                  </MenuItemLvl1>
                ))}
            </>
          ) : (
            [...Array(10)].map((item, i) => (
              <SkeletonDisplayText
                key={`item_${i}`}
                className="my-1 mx-3 w-[6rem]"
              />
            ))
          )}
        </ul>
      </nav>
    </>
  );
};

export default MegaMenu;
