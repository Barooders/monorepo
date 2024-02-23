import { MdArrowBackIosNew } from 'react-icons/md';

type PropsType = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  onGoBack?: () => void;
};

const SellingFormPageContainer: React.FC<PropsType> = ({
  children,
  title,
  subtitle,
  onGoBack,
}) => {
  return (
    <div className="w-full rounded-lg border border-gray-300 bg-gray-50">
      {title && (
        <div className="relative flex w-full flex-col border-b border-gray-300 p-5 text-center">
          {onGoBack && (
            <div className="absolute top-0 left-2 flex h-full items-center gap-1">
              <MdArrowBackIosNew
                className="h-8 w-8 cursor-pointer rounded-full p-2 hover:bg-gray-100"
                onClick={onGoBack}
              />
            </div>
          )}
          <p className="text-2xl font-semibold">{title}</p>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default SellingFormPageContainer;
