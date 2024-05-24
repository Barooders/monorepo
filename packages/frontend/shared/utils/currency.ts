export const roundCurrency = (x: number, precision = 2) =>
  Math.round(x * Math.pow(10, precision)) / Math.pow(10, precision);
export const formatCurrency = (x: number, options?: { round: boolean }) =>
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  roundCurrency(x, options?.round ? 0 : 2).toLocaleString('fr-FR', {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    minimumFractionDigits: !options?.round && x % 1 != 0 ? 2 : 0,
  });
