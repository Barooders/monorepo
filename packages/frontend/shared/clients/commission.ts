import { fetchBackend } from './backend';

type ArgsType = {
  productHandle?: string;
  productInternalId?: string;
  productVariantInternalId?: string;
};

export const fetchCommission = async ({
  productHandle,
  productInternalId,
  productVariantInternalId,
}: ArgsType) => {
  const fetchCommissionParams = new URLSearchParams();
  if (productHandle) fetchCommissionParams.set('productHandle', productHandle);
  if (productInternalId)
    fetchCommissionParams.set('productInternalId', productInternalId);
  if (productVariantInternalId)
    fetchCommissionParams.set('variantInternalId', productVariantInternalId);

  try {
    return await fetchBackend<number>(
      `/v1/commission/product?${fetchCommissionParams.toString()}`,
    );
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
