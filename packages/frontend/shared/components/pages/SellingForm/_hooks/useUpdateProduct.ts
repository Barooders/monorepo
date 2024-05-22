import useBackend from '@/hooks/useBackend';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { operations } from '@/__generated/rest-schema';
import useSellForm from '../_state/useSellForm';

const useUpdateProduct = () => {
  const { fetchAPI } = useBackend();
  const { extractTokenInfo } = useHasuraToken();

  const updateProduct = async (productId: string, variantId: string) => {
    const { shopifyId } = extractTokenInfo();
    if (!shopifyId) {
      throw new Error(
        "Jeton d'authentification expiré, veuillez vous reconnecter",
      );
    }

    const {
      tags,
      body_html,
      type,
      brand,
      compare_at_price,
      condition,
      price,
      handDeliveryPostalCode,
    } = useSellForm.getState().productInfos;

    if (!!price) {
      const variantBody:
        | operations['ProductController_updateProductVariant']['requestBody']['content']['application/json']
        | null = !!price
        ? {
            compareAtPrice:
              !compare_at_price || compare_at_price <= price
                ? undefined
                : { amountInCents: Math.round(compare_at_price * 100) },
            price: { amountInCents: Math.round(price * 100) },
            quantity: undefined,
            condition: condition ?? undefined,
          }
        : null;

      await fetchAPI(`/v1/products/${productId}/variants/${variantId}`, {
        method: 'PATCH',
        body: JSON.stringify(variantBody),
      });
    }

    const productBody: operations['ProductController_updateProduct']['requestBody']['content']['application/json'] =
      {
        tags,
        bodyHtml: body_html ?? '',
        handDeliveryPostalCode: handDeliveryPostalCode ?? undefined,
        product_type: type ?? '',
        title: `${type} ${brand}`,
        status: 'ACTIVE',
      };

    await fetchAPI(`/v1/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(productBody),
    });

    return true;
  };

  return useWrappedAsyncFn(updateProduct);
};

export default useUpdateProduct;
