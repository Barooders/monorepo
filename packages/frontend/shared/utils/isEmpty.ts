const isEmpty = (value: string | number | undefined | null) => {
  return value === undefined || value === null || value === '';
};

export default isEmpty;
