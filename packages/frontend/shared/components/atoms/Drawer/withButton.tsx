import { useState } from 'react';
import PortalDrawer from './portal';
import { DrawerSide } from './types';

type PropsType = {
  ContentComponent: React.FC<{ closeMenu: () => void }>;
  ButtonComponent: React.FC<{ openMenu: () => void }>;
  side?: DrawerSide;
};

const ButtonDrawer: React.FC<PropsType> = ({
  ButtonComponent,
  ContentComponent,
  side = DrawerSide.BOTTOM,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeMenu = () => {
    setIsOpen(false);
  };
  const openMenu = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="text-center">
        <ButtonComponent openMenu={openMenu} />
      </div>
      <PortalDrawer
        ContentComponent={ContentComponent}
        closeMenu={closeMenu}
        isOpen={isOpen}
        side={side}
      />
    </>
  );
};

export default ButtonDrawer;
