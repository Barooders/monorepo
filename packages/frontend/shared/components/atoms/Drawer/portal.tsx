import { MODAL_ROOT_ANCHOR } from '@/config';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import StaticDrawer from './static';
import { DrawerSide } from './types';

type PropsType = {
  isOpen: boolean;
  closeMenu: () => void;
  ContentComponent: React.FC<{ closeMenu: () => void }>;
  side?: DrawerSide;
};

const PortalDrawer: React.FC<PropsType> = ({
  ContentComponent,
  isOpen,
  closeMenu,
  side = DrawerSide.BOTTOM,
}) => {
  const [rootAnchorElement, setRootAnchorElement] =
    useState<null | HTMLElement>(null);

  useEffect(() => {
    setRootAnchorElement(
      document.getElementById(MODAL_ROOT_ANCHOR) ?? document.body,
    );
  }, []);

  return (
    <>
      {rootAnchorElement &&
        createPortal(
          <StaticDrawer
            isOpen={isOpen}
            closeMenu={closeMenu}
            ContentComponent={ContentComponent}
            side={side}
          />,
          rootAnchorElement,
        )}
    </>
  );
};

export default PortalDrawer;
