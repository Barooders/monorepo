import { fetchBackend } from './backend';

type ArgsType = {
  productHandle?: string;
  productId?: string;
  productVariant?: string;
};

export const fetchCommission = async ({
  productHandle,
  productId,
  productVariant,
}: ArgsType) => {
  const fetchCommissionParams = new URLSearchParams();
  if (productHandle) fetchCommissionParams.set('productHandle', productHandle);
  if (productId) fetchCommissionParams.set('productId', productId);
  if (productVariant) fetchCommissionParams.set('variantId', productVariant);

  try {
    return await fetchBackend<number>(
      `/v1/commission/product?${fetchCommissionParams.toString()}`,
    );
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
