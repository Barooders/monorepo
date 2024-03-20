'use client';

import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import { BIKE_CATEGORY_NAME, MTB_PRODUCT_TYPES } from '@/config/productTypes';
import { getDictionary } from '@/i18n/translate';
import { FaInfo } from 'react-icons/fa';
import { FaRotate } from 'react-icons/fa6';
import useAddProductImages from '../../../_hooks/useAddProductImages';
import useRefreshImages from '../../../_hooks/useRefreshImages';
import useSellForm from '../../../_state/useSellForm';
import { FormStepProps } from '../../../types';
import ImageItem from './ImageItem';
import SelectImageItem from './SelectImageItem';
import SellFormImagesAdvices from './SellFormImagesAdvices';

const dict = getDictionary('fr');
const imageStepLabels = dict.sellingForm.imageStep;

const defaultPlaceholderDatas = [
  imageStepLabels.imagePlaceholderData.front,
  imageStepLabels.imagePlaceholderData.side,
  imageStepLabels.imagePlaceholderData.back,
  imageStepLabels.imagePlaceholderData.logo,
  imageStepLabels.imagePlaceholderData.details,
  imageStepLabels.imagePlaceholderData.addPicture,
];

const bikePlaceholderDatas = [
  imageStepLabels.imagePlaceholderData.rightProfile,
  imageStepLabels.imagePlaceholderData.leftProfile,
  imageStepLabels.imagePlaceholderData.direction,
  imageStepLabels.imagePlaceholderData.frontDerailleur,
  imageStepLabels.imagePlaceholderData.rearDerailleur,
];

const mtbPlaceholderDatas = [
  ...bikePlaceholderDatas,
  imageStepLabels.imagePlaceholderData.fork,
];

const ImagesStep: React.FC<FormStepProps> = ({ productId }) => {
  const { productInfos, isInCategory } = useSellForm();
  const [addImagesState, uploadImages] = useAddProductImages();

  const [refreshImagesState, doRefreshImages] = useRefreshImages();

  const addImages = async (images: string[]) => {
    if (!productInfos.productId) throw new Error('No product id');
    uploadImages(productInfos.productId, images);
  };

  const placeholderDatas = isInCategory(BIKE_CATEGORY_NAME)
    ? bikePlaceholderDatas
    : MTB_PRODUCT_TYPES.includes(productInfos.type ?? '')
      ? mtbPlaceholderDatas
      : defaultPlaceholderDatas;

  return (
    <div className="p-5">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <p className="text-base font-bold">
            {imageStepLabels.insertPictures}
          </p>
          <p className="mt-2 text-sm">{imageStepLabels.minimumPictures}</p>
        </div>
        <button
          onClick={() => doRefreshImages(productId)}
          className="flex items-center gap-2 px-1 py-1 text-sm"
        >
          <FaRotate
            className={refreshImagesState.loading ? 'animate-spin' : ''}
          />
          {imageStepLabels.refresh}
        </button>
      </div>

      <div className="mt-5 flex flex-row flex-wrap">
        {productInfos.images.length > 0 ? (
          <>
            {productInfos.images.map((image, idx) => (
              <ImageItem
                key={idx}
                image={image}
              />
            ))}
            <SelectImageItem
              isLoading={addImagesState.loading}
              title={imageStepLabels.addAPicture}
              onImagesSelected={addImages}
              withAddButton
            />
          </>
        ) : (
          placeholderDatas.map((placeholder, i) => (
            <SelectImageItem
              onImagesSelected={addImages}
              isLoading={i === 0 && addImagesState.loading}
              key={i}
              title={placeholder}
              withAddButton
            />
          ))
        )}
      </div>

      <div className="mt-5 flex">
        <Modal
          ButtonComponent={({ openModal }) => (
            <Button
              onClick={openModal}
              className="flex items-center gap-4"
              intent="tertiary"
            >
              <FaInfo />
              <div className="flex flex-col items-start">
                <p className="text-base font-bold">
                  {imageStepLabels.advisePopup.buttonTitle}
                </p>
                <p className="text-secondary-content mt-1 text-sm">
                  {imageStepLabels.advisePopup.buttonSubtitle}
                </p>
              </div>
            </Button>
          )}
          ContentComponent={() => <SellFormImagesAdvices />}
        />
      </div>
    </div>
  );
};

export default ImagesStep;
