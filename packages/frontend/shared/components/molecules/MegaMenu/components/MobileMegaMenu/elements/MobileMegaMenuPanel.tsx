import { useState } from 'react';
import clsx from 'clsx';

import Button from '@/components/molecules/MegaMenu/elements/UI/Button';
import {
  ArrowToLeft,
  Close,
} from '@/components/molecules/MegaMenu/elements/UI/Icons';
import {
  IconContainer,
  Icon,
} from '@/components/molecules/MegaMenu/elements/UI/Icon';

import MobileMegaMenuCard from './MobileMegaMenuCard';
import MobileMegaMenuItem from './MobileMegaMenuItem';

import {
  MegaMenuItem,
  MegaMenuCardType,
} from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { getDictionary } from '@/i18n/translate';
import {
  MdOutlineAccountCircle,
  MdOutlineMailOutline,
  MdFavoriteBorder,
  MdNotificationsNone,
  MdOutlineSell,
} from 'react-icons/md';
import { Url } from '@/types';
import SellButton from '@/components/atoms/SellButton';

const dict = getDictionary('fr');

type Props = {
  currentItem?: MegaMenuItem;
  childItems: MegaMenuItem[];
  childCards?: MegaMenuCardType[];
  isToggled: boolean;
  appearFrom?: 'left' | 'right';
  title?: string;
  onGoBack?: () => void;
  onClose?: () => void;
};

const profileLinks: { link: Url; label: string; Icon: React.FC }[] = [
  {
    link: '/account',
    label: dict.header.menu.myAccount,
    Icon: MdOutlineAccountCircle,
  },
  {
    link: '/selling-form/create',
    label: dict.header.menu.sellButton,
    Icon: MdOutlineSell,
  },
  {
    link: '/pages/chat',
    label: dict.header.menu.messages,
    Icon: MdOutlineMailOutline,
  },
  {
    link: '/pages/favoris',
    label: dict.header.menu.favorites,
    Icon: MdFavoriteBorder,
  },
  {
    link: '/account/search-alerts',
    label: dict.header.menu.alerts,
    Icon: MdNotificationsNone,
  },
];

const MobileMegaMenuPanel = ({
  currentItem,
  childItems,
  childCards,
  isToggled,
  appearFrom = 'left',
  title,
  onGoBack,
  onClose,
}: Props) => {
  const [activeSiblingPanelId, setActiveSiblingPanelId] = useState<
    number | undefined
  >(undefined);

  /**
   * It shows a sibling panel matching the id of the clicked item.
   * @param {MegaMenuItem} item - A mega menu item.
   * @returns {void}
   */
  const openSiblingPanel = (item: MegaMenuItem): void => {
    setActiveSiblingPanelId(item.id);
  };

  /**
   * It closes the active sibling panel.
   * @returns {void}
   */
  const closeSiblingPanel = (): void => {
    setActiveSiblingPanelId(undefined);
  };

  /**
   * It closes every active panels so that when closing and re-opening
   * the menu, the whole navigation is resetted.
   * @returns {void}
   */
  const closeEveryPanels = (): void => {
    // Close previous panels
    if (onGoBack !== undefined) onGoBack();

    if (onClose !== undefined) onClose();

    // Close active sibling panel
    closeSiblingPanel();
  };

  const isMainTab = !onGoBack;

  return (
    <>
      {/* Transparent overlay for close on click event */}
      <div
        className={clsx([
          `pointer-events-none fixed inset-0 z-50 opacity-0`,
          isToggled && `pointer-events-auto opacity-100`,
        ])}
        onClick={closeEveryPanels}
      ></div>
      {/* Panel */}
      <div
        className={clsx([
          `fixed inset-0 z-50 flex h-screen w-screen max-w-md flex-col overflow-y-auto overflow-x-hidden bg-white pb-20 transition-transform duration-300`,
          isToggled
            ? 'translate-x-0'
            : appearFrom === 'left'
            ? '-translate-x-full'
            : `translate-x-full xs:-translate-x-full`,
        ])}
      >
        {isToggled && (
          <>
            {/* Heading container */}
            <div className="align-center flex justify-center border-b border-slate-200 px-5 py-3">
              {onGoBack !== undefined && (
                <Button
                  className="p-0"
                  onClick={onGoBack}
                >
                  <IconContainer
                    width="18px"
                    height="18px"
                  >
                    <Icon source={ArrowToLeft} />
                  </IconContainer>
                </Button>
              )}
              <div className="m-auto text-center text-base font-bold">
                {title ?? ' '}
              </div>
              {onClose !== undefined && (
                <Button
                  className="p-0"
                  onClick={onClose}
                >
                  <IconContainer
                    width="14px"
                    height="14px"
                  >
                    <Icon source={Close} />
                  </IconContainer>
                </Button>
              )}
            </div>

            {/* Navigation items */}
            <nav
              role="navigation"
              className=""
            >
              <ul className="flex flex-col">
                {childItems
                  .filter(
                    (item) => currentItem?.isBackbone || !item.isHiddenInMenu,
                  )
                  .map((childItem, i) => (
                    <MobileMegaMenuItem
                      key={`child_item-${i}`}
                      onClick={
                        childItem.children
                          ? () => openSiblingPanel(childItem)
                          : onClose
                      }
                      hasChildren={!!childItem.children}
                      url={childItem.url}
                      target={childItem.target ?? undefined}
                    >
                      {childItem.title}
                    </MobileMegaMenuItem>
                  ))}

                {currentItem && currentItem.url !== '#' && (
                  <MobileMegaMenuItem
                    hasChildren={false}
                    url={currentItem.url}
                    target={currentItem.target ?? undefined}
                  >
                    <span className="font-semibold">
                      Voir tout &quot;
                      {currentItem.title}
                      &quot;
                    </span>
                  </MobileMegaMenuItem>
                )}

                {/* My account buttons */}
                {isMainTab && (
                  <>
                    <div className="mt-3 justify-self-start border-t border-slate-300 px-5 py-5">
                      <SellButton />
                    </div>
                    <p className="border-t border-slate-300 px-5 py-3 text-xs text-slate-400">
                      {dict.header.menu.mySpace}
                    </p>
                    <nav>
                      <ul className="w-full">
                        {profileLinks.map(({ link, Icon, label }) => (
                          <MobileMegaMenuItem
                            hasChildren={false}
                            key={link}
                            url={link}
                          >
                            <span className="flex items-center gap-2">
                              <Icon />
                              {label}
                            </span>
                          </MobileMegaMenuItem>
                        ))}
                      </ul>
                    </nav>
                  </>
                )}

                {childCards?.map((childCard, i) => (
                  <MobileMegaMenuCard
                    key={`child_itemç${i}`}
                    card={childCard}
                  />
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Children panels (as siblings) */}
      {isToggled &&
        childItems.map(
          (childItem, i) =>
            childItem?.children?.items && (
              <MobileMegaMenuPanel
                key={`child_item_${i}`}
                title={childItem.title}
                currentItem={childItem}
                childItems={childItem.children.items}
                childCards={childItem.children.cards}
                isToggled={childItem.id === activeSiblingPanelId}
                appearFrom="right"
                onGoBack={closeSiblingPanel}
                onClose={closeEveryPanels}
              />
            ),
        )}
    </>
  );
};

export default MobileMegaMenuPanel;
