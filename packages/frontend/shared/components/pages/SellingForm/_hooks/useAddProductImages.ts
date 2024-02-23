import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { operations } from '@/__generated/rest-schema';
import { ImageType } from '../types';
import useSellForm from '../_state/useSellForm';

const useAddProductImages = () => {
  const { fetchAPI } = useBackend();
  const { productInfos, addProductInfo } = useSellForm();

  const addProductImage = async (productId: string, imageBase64: string) => {
    const uri = `/v1/products/${productId}/image`;
    const body = JSON.stringify({
      attachment: imageBase64,
    });
    const result = await fetchAPI<
      operations['ProductController_addProductImage']['responses']['201']['content']['application/json']
    >(uri, { method: 'POST', body });

    return { src: result.src, id: parseInt(result.id) };
  };

  const addProductImages = async (
    productId: string,
    imagesBase64: string[],
  ) => {
    const imageUrls: ImageType[] = [];
    for (const imageContent of imagesBase64) {
      const image = await addProductImage(productId, imageContent);
      if (image.id) imageUrls.push(image);
    }
    addProductInfo('images', [...productInfos.images, ...imageUrls]);
  };

  return useWrappedAsyncFn(addProductImages, [productInfos.images]);
};

export default useAddProductImages;
