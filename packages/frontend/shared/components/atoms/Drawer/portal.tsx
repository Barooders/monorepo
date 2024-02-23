import { MODAL_ROOT_ANCHOR } from '@/config';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import StaticDrawer from './static';

type PropsType = {
  ContentComponent: React.FC<{ closeMenu: () => void }>;
  ButtonComponent: React.FC<{ openMenu: () => void }>;
};

const PortalDrawer: React.FC<PropsType> = ({
  ButtonComponent,
  ContentComponent,
}) => {
  const [rootAnchorElement, setRootAnchorElement] =
    useState<null | HTMLElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => {
    setIsOpen(false);
  };
  const openMenu = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    setRootAnchorElement(
      document.getElementById(MODAL_ROOT_ANCHOR) ?? document.body,
    );
  }, []);

  return (
    <>
      <div className="text-center">
        <ButtonComponent openMenu={openMenu} />
      </div>
      {rootAnchorElement &&
        createPortal(
          <StaticDrawer
            isOpen={isOpen}
            onCloseMenu={closeMenu}
            ContentComponent={ContentComponent}
          />,
          rootAnchorElement,
        )}
    </>
  );
};

export default PortalDrawer;
