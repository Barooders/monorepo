import Loader from '@/components/atoms/Loader';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import FileInput from './_components/FileInput';

interface SelectImageItemProps {
  withAddButton?: boolean;
  title?: string;
  isLoading?: boolean;
  onImagesSelected: (images: string[]) => void;
}

const SelectImageItem = ({
  withAddButton = false,
  title,
  isLoading,
  onImagesSelected,
}: SelectImageItemProps) => {
  return (
    <div className="mb-3 w-1/3 pr-2">
      <FileInput
        onImagesSelected={(images) =>
          onImagesSelected(
            images
              .map((image) => image?.toString() ?? '')
              .filter((image) => !!image),
          )
        }
        buttonComponent={
          <>
            <div
              className={`flex h-[106px] cursor-pointer justify-center ${
                withAddButton ? 'bg-gray-100' : 'bg-white'
              } items-center rounded-lg border border-gray-200`}
            >
              {isLoading ? (
                <Loader />
              ) : withAddButton ? (
                <HiOutlinePlusCircle className="text-5xl text-gray-300" />
              ) : null}
            </div>
            {title && (
              <p className="text-tertiary mt-2 px-2 text-center text-xs">
                {title}
              </p>
            )}
          </>
        }
      />
    </div>
  );
};

export default SelectImageItem;
