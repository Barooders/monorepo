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
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (productHandle) fetchCommissionParams.set('productHandle', productHandle);
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (productInternalId)
    fetchCommissionParams.set('productInternalId', productInternalId);
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (productVariantInternalId)
    fetchCommissionParams.set(
      'variantInternalId',
      productVariantInternalId.toString(),
    );

  try {
    return await fetchBackend<number>(
      `/v1/commission/product?${fetchCommissionParams.toString()}`,
    );
  } catch (e) {
    console.info(e);
    return undefined;
  }
};
