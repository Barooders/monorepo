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
  return useWrappedAsyncFn(async (productInternalId: string): Promise<void> => {
    if (productInfos.productInternalId === productInternalId) return;
    const rawProduct = await fetchAPI<
      operations['ProductController_getProduct']['responses']['default']['content']['application/json']
    >(`/v1/products/${productInternalId}`);

    if (!rawProduct) throw new Error('Product not found in Shopify');

    const mainVariant = first(rawProduct.variants);

    if (!mainVariant)
      throw new Error(`No variant found for product ${productInternalId}`);

    loadProductInForm({
      variantInternalId: mainVariant.internalId,
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
      productInternalId,
      condition: mainVariant.condition as Condition,
      tags: rawProduct.tags,
      vendor: {
        id: rawProduct.vendor,
        phoneNumber: null,
      },
    });
  });
};

export default useGetProductToUpdate;
