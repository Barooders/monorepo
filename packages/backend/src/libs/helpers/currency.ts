export const toCents = (amount: number | string) =>
  Math.round(Number(amount) * 100);

export const fromCents = (amount: number | string) => Number(amount) / 100;
