import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { operations } from '@/__generated/rest-schema';
import first from 'lodash/first';
import { ProductStatus } from '@/types';
import useSellForm from '../_state/useSellForm';
import { Condition } from '../types';

const useGetProductToUpdate = () => {
  const { loadProductInForm, productInfos } = useSellForm();
  const { fetchAPI } = useBackend();
  return useWrappedAsyncFn(
    async (productId: string, variantId?: string): Promise<void> => {
      if (productInfos.productId === productId) return;
      const rawProduct = await fetchAPI<
        operations['ProductController_getProductByAdmin']['responses']['default']['content']['application/json']
      >(`/v1/admin/products/${productId}`);

      if (!rawProduct) throw new Error('Product not found in Shopify');

      const mainVariant =
        rawProduct.variants.find(
          (variant) => variant.id.toString() === variantId,
        ) ?? first(rawProduct.variants);

      if (!mainVariant)
        throw new Error(`No variant found for product ${productId}`);

      loadProductInForm({
        variantId: mainVariant.id.toString(),
        compareAtPrice: Number(mainVariant.compare_at_price),
        price: Number(mainVariant.price),
        description: rawProduct.body_html,
        handDeliveryPostalCode: null,
        images: rawProduct.images.map((image) => ({
          src: image.src,
          id: image.id,
        })),
        status: rawProduct.status as ProductStatus,
        productType: rawProduct.product_type,
        id: productId,
        condition: mainVariant.condition as Condition,
        tags: rawProduct.tags,
        vendor: {
          id: rawProduct.vendor,
          phoneNumber: null,
        },
      });
    },
  );
};

export default useGetProductToUpdate;
