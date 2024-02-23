type Props = {
  children?: React.ReactNode;
};

const MegaMenuPanel = ({ children }: Props) => {
  return (
    <div className="absolute inset-x-0 z-20 hidden w-full group-hover:flex 2xl:top-[unset]">
      <div className="mt-2 w-full rounded-xl bg-white p-5 shadow-no-offset">
        {children}
      </div>
    </div>
  );
};

export default MegaMenuPanel;
