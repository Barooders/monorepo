import { MdChevronRight } from 'react-icons/md';

type PropsType = {
  onClick?: () => void;
  displayChevron?: boolean;
  children: React.ReactNode;
};

const SellingFormLine: React.FC<PropsType> = ({
  children,
  displayChevron = true,
  onClick,
}) => {
  return (
    <div
      className="border-b-300 flex cursor-pointer items-center justify-between border-b px-5 py-4 hover:bg-gray-100"
      onClick={onClick}
    >
      {children}
      {displayChevron && <MdChevronRight className="text-2xl text-gray-700" />}
    </div>
  );
};

export default SellingFormLine;
