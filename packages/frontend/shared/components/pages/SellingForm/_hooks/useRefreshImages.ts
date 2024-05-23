import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { operations } from '@/__generated/rest-schema';
import useSellForm from '../_state/useSellForm';

const useRefreshImages = () => {
  const { refreshImages, productInfos } = useSellForm();
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (productInternalId: string): Promise<void> => {
      const rawProduct = await fetchAPI<
        operations['ProductController_getProduct']['responses']['default']['content']['application/json']
      >(`/v1/products/${productInternalId}`);

      if (!rawProduct) throw new Error('Product not found in Shopify');

      refreshImages(
        rawProduct.images.map((image) => ({
          src: image.src,
          id: image.id,
        })),
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [productInfos],
  );
};

export default useRefreshImages;
