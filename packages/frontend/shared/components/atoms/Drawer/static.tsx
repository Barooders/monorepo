import { MdClose } from 'react-icons/md';

type PropsType = {
  ContentComponent: React.FC<{ closeMenu: () => void }>;
  isOpen: boolean;
  onCloseMenu: () => void;
};

const StaticDrawer: React.FC<PropsType> = ({
  isOpen,
  onCloseMenu,
  ContentComponent,
}) => {
  return (
    <>
      <div
        className={`fixed bottom-0 left-0 right-0 z-50 w-full ${
          isOpen ? 'transform-none' : 'translate-y-full'
        } rounded-t-xl bg-white p-4 pt-8 transition-transform`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onCloseMenu}
          className="absolute top-2.5 right-2.5 inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900"
        >
          <MdClose />
        </button>
        <ContentComponent closeMenu={onCloseMenu} />
      </div>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 overscroll-none bg-gray-900 bg-opacity-50"
          onClick={onCloseMenu}
        ></div>
      )}
    </>
  );
};

export default StaticDrawer;
