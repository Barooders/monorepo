import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { operations } from '@/__generated/rest-schema';
import useSellForm from '../_state/useSellForm';

const useDeleteImage = () => {
  const { fetchAPI } = useBackend();
  const { productInfos, addProductInfo } = useSellForm();

  const deleteProductImage = async (imageShopifyId: number) => {
    const uri = `/v1/products/${productInfos.productInternalId}/image/${imageShopifyId}`;
    await fetchAPI<
      operations['ProductController_deleteProductImage']['responses']['200']['content']['application/json']
    >(uri, { method: 'DELETE' });

    addProductInfo(
      'images',
      productInfos.images.filter((image) => image.id !== imageShopifyId),
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useWrappedAsyncFn(deleteProductImage, [productInfos.images]);
};

export default useDeleteImage;
