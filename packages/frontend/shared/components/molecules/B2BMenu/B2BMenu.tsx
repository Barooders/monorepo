import MegaMenuPanel from '../MegaMenu/components/MegaMenu/elements/MegaMenuPanel';
import MegaMenuPanelContent from '../MegaMenu/components/MegaMenu/elements/MegaMenuPanelContent';
import MenuItemLvl1 from '../MegaMenu/components/MegaMenu/elements/MenuItemLvl1';
import SkeletonDisplayText from '../MegaMenu/elements/UI/Skeleton';
import { MegaMenuChunk } from '../MegaMenu/shared/types/app/MegaMenu.types';

const B2BMenu: React.FC<{ menu: MegaMenuChunk }> = ({ menu }) => {
  return (
    <>
      {/* Desktop navigation */}
      <nav
        role="navigation"
        className="relative z-20 m-0 w-full"
      >
        <ul className="scrollbar-hidden m-0 flex w-full justify-center overflow-x-auto bg-white">
          {menu ? (
            <>
              {menu.items
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
            [...Array(4)].map((item, i) => (
              <SkeletonDisplayText
                key={`item_${i}`}
                className="mx-3 my-1 w-[6rem]"
              />
            ))
          )}
        </ul>
      </nav>
    </>
  );
};

export default B2BMenu;
