export const getValidShopifyId = (id: string | number): number => {
  const idNumber = Number(id);
  if (isNaN(idNumber)) throw new Error(`Invalid shopify id: ${id}`);

  return idNumber;
};
