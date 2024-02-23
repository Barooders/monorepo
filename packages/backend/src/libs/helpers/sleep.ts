export const sleep: (ms?: number) => void = (ms?: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
