// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const gtag = (...args: any[]) => {
  if (!window.gtag) return;
  window.gtag(...args);
};
