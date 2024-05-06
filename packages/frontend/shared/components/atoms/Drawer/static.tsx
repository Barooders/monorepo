// Don't use useLockBodyScroll from react-use
// See issue https://github.com/streamich/react-use/issues/2388
import { usePreventScroll } from '@react-aria/overlays';
import { MdClose } from 'react-icons/md';
import { useKeyPressEvent } from 'react-use';
import { DrawerSide } from './types';

type PropsType = {
  ContentComponent: React.FC<{ closeMenu: () => void }>;
  isOpen: boolean;
  closeMenu: () => void;
  side?: DrawerSide;
};

const StaticDrawer: React.FC<PropsType> = ({
  isOpen,
  closeMenu,
  ContentComponent,
  side = DrawerSide.BOTTOM,
}) => {
  useKeyPressEvent('Escape', closeMenu);
  usePreventScroll({ isDisabled: !isOpen });

  const positionStyle = {
    [DrawerSide.BOTTOM]: {
      container: `bottom-0 left-0 right-0 ${
        isOpen ? 'transform-none' : 'translate-y-full'
      } rounded-t-xl w-full`,
      closeButton: 'right-2.5 top-2.5',
    },
    [DrawerSide.LEFT]: {
      container: `left-0 top-0 bottom-0 ${
        isOpen ? 'transform-none' : '-translate-x-full'
      }`,
      closeButton: 'right-2.5 top-2.5',
    },
    [DrawerSide.RIGHT]: {
      container: `right-0 top-0 bottom-0 ${
        isOpen ? 'transform-none' : 'translate-x-full'
      }`,
      closeButton: 'left-2.5 top-2.5',
    },
  };

  return (
    <>
      <div
        className={`${positionStyle[side].container} fixed z-50 overflow-scroll bg-white p-4 pt-8 transition-transform`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={closeMenu}
          className={`${positionStyle[side].closeButton} absolute inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900`}
        >
          <MdClose />
        </button>
        <ContentComponent closeMenu={closeMenu} />
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 overscroll-none bg-gray-900 bg-opacity-50"
          onClick={closeMenu}
        ></div>
      )}
    </>
  );
};

export default StaticDrawer;
