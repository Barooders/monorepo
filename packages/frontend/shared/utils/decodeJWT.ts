export const decodeJWT = <T>(token: string): T => {
  const base64Url = token.split('.')[1];
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!base64Url) throw new Error(`Invalid token: (${token})`);
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split('')
      .map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join(''),
  );

  return JSON.parse(jsonPayload) as T;
};
