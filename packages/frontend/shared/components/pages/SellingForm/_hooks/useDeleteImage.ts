import { operations } from '@/__generated/rest-schema';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useSellForm from '../_state/useSellForm';

const useDeleteImage = () => {
  const { fetchAPI } = useBackend();
  const { productInfos, addProductInfo } = useSellForm();

  const deleteProductImage = async (imageStoreId: string) => {
    const uri = `/v1/products/${productInfos.productInternalId}/image/${imageStoreId}`;
    await fetchAPI<
      operations['ProductController_deleteProductImage']['responses']['200']['content']['application/json']
    >(uri, { method: 'DELETE' });

    addProductInfo(
      'images',
      productInfos.images.filter((image) => image.storeId !== imageStoreId),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useWrappedAsyncFn(deleteProductImage, [productInfos.images]);
};

export default useDeleteImage;
