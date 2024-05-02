import useBackend from '@/hooks/useBackend';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import omitBy from 'lodash/omitBy';
import useSellForm from '../_state/useSellForm';

const omitNullValues = (obj: Record<string, unknown>) =>
  omitBy(obj, (value) => value === null);

const useCreateProduct = () => {
  const { fetchAPI } = useBackend();
  const { extractTokenInfo } = useHasuraToken();

  const createProduct = async () => {
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
      model,
      compare_at_price,
      condition,
      price,
      handDelivery,
      handDeliveryPostalCode,
    } = useSellForm.getState().productInfos;

    const uri = `/v1/products/create`;
    const body = JSON.stringify(
      omitNullValues({
        tags,
        body_html,
        compare_at_price,
        condition,
        price,
        handDelivery,
        handDeliveryPostalCode,
        sellerId: shopifyId,
        images: [],
        product_type: type,
        title: `${type} ${brand} ${model}`,
        metafields: [
          {
            namespace: 'barooders',
            key: 'source',
            value: 'New sell form',
            description: 'Source of the product creation',
            value_type: 'string',
          },
        ],
      }),
    );

    const result = await fetchAPI<{
      body: { product: { shopifyId: number } };
    }>(uri, {
      method: 'POST',
      body,
    });

    if (!result.body?.product?.shopifyId) {
      throw new Error('Missing shopifyId product in the response');
    }

    return result.body.product.shopifyId.toString();
  };

  return useWrappedAsyncFn(createProduct);
};

export default useCreateProduct;
