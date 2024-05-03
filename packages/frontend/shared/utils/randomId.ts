export const randomId = (size: number) => {
  return [...Array(size)]
    .map(() => (~~(Math.random() * 36)).toString(36))
    .join('');
};
