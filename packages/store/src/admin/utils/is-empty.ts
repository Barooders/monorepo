const isEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value === '';
};

export default isEmpty;
