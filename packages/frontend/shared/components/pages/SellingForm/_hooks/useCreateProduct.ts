import { operations } from '@/__generated/rest-schema';
import useBackend from '@/hooks/useBackend';
import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import omitBy from 'lodash/omitBy';
import useSellForm from '../_state/useSellForm';

const omitNullValues = (obj: Record<string, unknown>) =>
  omitBy(obj, (value) => value === null);

const useCreateProduct = () => {
  const { fetchAPI } = useBackend();
  const { isLoggedIn } = useIsLoggedIn();

  const createProduct = async () => {
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

    const { internalId } = await fetchAPI<
      operations['ProductController_createDraftProduct']['responses']['default']['content']['application/json']
    >(uri, {
      method: 'POST',
      body,
    });

    return internalId;
  };

  return useWrappedAsyncFn(createProduct);
};

export default useCreateProduct;
