export const base64_encode = (str: string) => {
  return Buffer.from(str).toString('base64');
};

export const base64_decode = (str: string) => {
  return Buffer.from(str, 'base64').toString('ascii');
};
