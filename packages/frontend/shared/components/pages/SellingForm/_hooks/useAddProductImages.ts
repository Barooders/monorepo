import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { operations } from '@/__generated/rest-schema';
import { ImageType } from '../types';
import useSellForm from '../_state/useSellForm';

const useAddProductImages = () => {
  const { fetchAPI } = useBackend();
  const { productInfos, addProductInfo } = useSellForm();

  const addProductImage = async (
    productInternalId: string,
    imageBase64: string,
  ) => {
    const uri = `/v1/products/${productInternalId}/image`;
    const body = JSON.stringify({
      attachment: imageBase64,
    });
    const result = await fetchAPI<
      operations['ProductController_addProductImage']['responses']['201']['content']['application/json']
    >(uri, { method: 'POST', body });

    return { src: result.src, storeId: result.id };
  };

  const addProductImages = async (
    productInternalId: string,
    imagesBase64: string[],
  ) => {
    const imageUrls: ImageType[] = [];
    for (const imageContent of imagesBase64) {
      const image = await addProductImage(productInternalId, imageContent);
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (image.storeId) imageUrls.push(image);
    }
    addProductInfo('images', [...productInfos.images, ...imageUrls]);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useWrappedAsyncFn(addProductImages, [productInfos.images]);
};

export default useAddProductImages;
