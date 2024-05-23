import { fetchBackend } from './backend';

type CollectionType = {
  id: string;
  shopifyId: number;
  handle: string;
  shortName: string | null;
  title: string | null;
};

export type ProductDTO = {
  id: string;
  breadcrumbs: CollectionType[];
};

export const fetchProductByHandle = async (productHandle: string) => {
  try {
    return await fetchBackend<ProductDTO>(
      `/v1/products/by-handle/${productHandle}`,
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};
