import { operations } from '@/__generated/rest-schema';
import useBackend from '@/hooks/useBackend';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import useSellForm from '../_state/useSellForm';

const useUpdateProduct = () => {
  const { fetchAPI } = useBackend();
  const { isLoggedIn } = useIsLoggedIn();

  const updateProduct = async (
    productInternalId: string,
    variantInternalId: string,
  ) => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!isLoggedIn) {
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

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!!price) {
      const variantBody:
        | operations['ProductController_updateProductVariant']['requestBody']['content']['application/json']
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        | null = !!price
        ? {
            compareAtPrice:
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              !compare_at_price || compare_at_price <= price
                ? undefined
                : { amountInCents: Math.round(compare_at_price * 100) },
            price: { amountInCents: Math.round(price * 100) },
            quantity: undefined,
            condition: condition ?? undefined,
          }
        : null;

      await fetchAPI(
        `/v1/products/${productInternalId}/variants/${variantInternalId}`,
        {
          method: 'PATCH',
          body: JSON.stringify(variantBody),
        },
      );
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

    await fetchAPI(`/v1/products/${productInternalId}`, {
      method: 'PATCH',
      body: JSON.stringify(productBody),
    });

    return true;
  };

  return useWrappedAsyncFn(updateProduct);
};

export default useUpdateProduct;
