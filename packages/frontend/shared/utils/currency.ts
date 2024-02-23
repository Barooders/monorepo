export const roundCurrency = (x: number, precision = 2) =>
  Math.round(x * Math.pow(10, precision)) / Math.pow(10, precision);
export const formatCurrency = (x: number, options?: { round: boolean }) =>
  roundCurrency(x, options?.round ? 0 : 2).toLocaleString('fr-FR', {
    minimumFractionDigits: !options?.round && x % 1 != 0 ? 2 : 0,
  });
