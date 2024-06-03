import Loader from '@/components/atoms/Loader';
import { MdClose } from 'react-icons/md';
import { ImageType } from '../../../types';
import useDeleteImage from '../../../_hooks/useDeleteImage';

interface ImageItemProps {
  image: ImageType;
}

const ImageItem = ({ image }: ImageItemProps) => {
  const [deleteImageState, deleteImage] = useDeleteImage();
  return (
    <>
      <div className="mb-3 w-1/3 pr-2">
        <div className="relative h-[106px] items-center justify-center rounded-lg border border-[#E3E6E8]">
          <div
            className="absolute right-2 top-2 z-20 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full bg-[#E3E6E8]"
            onClick={() => deleteImage(image.storeId)}
          >
            {deleteImageState.loading ? <Loader /> : <MdClose />}
          </div>
          <img
            src={image.src}
            className="h-full w-full rounded-lg object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default ImageItem;
