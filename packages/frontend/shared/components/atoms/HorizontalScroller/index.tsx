import Loader from '../Loader';

type PropsType = {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
};

const HorizontalScroller: React.FC<PropsType> = ({
  children,
  isLoading = false,
  className,
}) => {
  return (
    <div
      className={`scrollbar-thin flex gap-3 overflow-x-auto overflow-y-hidden ${className}`}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default HorizontalScroller;
