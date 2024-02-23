'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { IoMdMenu } from 'react-icons/io';
import MobileMegaMenuSkeleton from './elements/MobileMegaMenuSkeleton';
import MobileMegaMenuPanel from './elements/MobileMegaMenuPanel';
import {
  lockScroll,
  unlockScroll,
} from '@/components/molecules/MegaMenu/shared/helpers/utils.helper';
import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type Props = {
  megaMenu?: MegaMenuChunk;
};

const BACKBONE_ID = Math.round(Math.random() * 10000);

const MobileMegaMenu = ({ megaMenu }: Props) => {
  const [isToggled, setIsToggled] = useState<boolean>(false);

  /**
   * It opens mega menu.
   * @returns {void}
   */
  const openMenu = () => {
    lockScroll();
    setIsToggled(true);
  };

  /**
   * It closes mega menu.
   * @returns {void}
   */
  const closeMenu = () => {
    unlockScroll();
    setIsToggled(false);
  };

  const backboneItem = {
    isBackbone: true,
    isHiddenInMenu: false,
    mobileHeaderOrder: 0,
    children: {
      items: megaMenu?.items.filter(({ isBackbone }) => isBackbone) ?? [],
      cards: megaMenu?.cards ?? [],
    },
    title: dict.header.menu.backbone,
    id: BACKBONE_ID,
    url: '/',
    target: null,
  };

  return (
    <div>
      {/* Burger button */}
      <button
        onClick={openMenu}
        className="absolute left-4 top-2 flex cursor-pointer items-center justify-center px-3 py-2 lg:static"
      >
        <IoMdMenu className="h-5 w-5 text-gray-500" />
      </button>

      {/* Overlay */}
      <div
        className={clsx([
          `pointer-events-none fixed inset-0 z-50 bg-black bg-opacity-20 opacity-0 transition-opacity duration-300`,
          isToggled && `pointer-events-auto opacity-100`,
        ])}
        onClick={closeMenu}
      ></div>

      {megaMenu ? (
        <MobileMegaMenuPanel
          title="Barooders"
          childItems={[backboneItem, ...megaMenu.items]}
          childCards={megaMenu.cards}
          isToggled={isToggled}
          onClose={closeMenu}
        />
      ) : (
        <MobileMegaMenuSkeleton
          isToggled={isToggled}
          onClose={closeMenu}
          onGoBack={closeMenu}
        />
      )}
    </div>
  );
};

export default MobileMegaMenu;
