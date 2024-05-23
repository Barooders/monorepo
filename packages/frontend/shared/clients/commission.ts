import { fetchBackend } from './backend';

type ArgsType = {
  productHandle?: string;
  productInternalId?: string;
  productVariantShopifyId?: number;
};

export const fetchCommission = async ({
  productHandle,
  productInternalId,
  productVariantShopifyId,
}: ArgsType) => {
  const fetchCommissionParams = new URLSearchParams();
  if (productHandle) fetchCommissionParams.set('productHandle', productHandle);
  if (productInternalId)
    fetchCommissionParams.set('productInternalId', productInternalId);
  if (productVariantShopifyId)
    fetchCommissionParams.set(
      'variantShopifyId',
      productVariantShopifyId.toString(),
    );

  try {
    return await fetchBackend<number>(
      `/v1/commission/product?${fetchCommissionParams.toString()}`,
    );
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
