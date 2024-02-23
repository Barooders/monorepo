/* eslint-disable no-restricted-syntax */

export const jsonStringify = (value: any, space?: number) => {
  return JSON.stringify(
    value,
    (key, value) => (typeof value === 'bigint' ? value.toString() : value),
    space,
  );
};

export const jsonParse = (value: any): any => {
  return JSON.parse(value);
};
