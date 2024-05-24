import { fetchAuth } from '@/clients/auth';
import { BackendFailureException } from '@/exception/backend-failure.exception';
import { HasuraAuthJwtType, HasuraToken } from '@/types';
import { decodeJWT } from '@/utils/decodeJWT';
import useUser from './state/useUser';
import useIsLoggedIn from './useIsLoggedIn';

export const LOCAL_STORAGE_HASURA_TOKEN_KEY = 'hasura_token';
const TOKEN_VALIDITY_TIME_THRESHOLD = 30;

export const useHasuraToken = () => {
  const { setHasuraToken, logoutUser } = useUser();
  const { redirectToLogin } = useIsLoggedIn();

  const { hasuraToken } = useUser.getState();

  const clearOldTokenState = () => {
    localStorage.removeItem(LOCAL_STORAGE_HASURA_TOKEN_KEY);
  };

  const checkTokenValidity = (token: HasuraToken): boolean => {
    const creationDate = new Date(token.creationDate);
    const expirationDate = creationDate.setSeconds(
      creationDate.getSeconds() +
        token.accessTokenExpiresIn -
        TOKEN_VALIDITY_TIME_THRESHOLD,
    );
    return expirationDate > Date.now();
  };

  const getUpToDateHasuraToken = async () => {
    if (hasuraToken && !checkTokenValidity(hasuraToken)) {
      return consumeRefreshToken(hasuraToken.refreshToken);
    }
    return hasuraToken;
  };

  const storeNewToken = (
    hasuraToken: Omit<HasuraToken, 'creationDate'>,
  ): HasuraToken => {
    clearOldTokenState();
    const newHasuraToken = {
      ...hasuraToken,
      creationDate: Date.now(),
    } as HasuraToken;
    setHasuraToken(newHasuraToken);

    return newHasuraToken;
  };

  const consumeRefreshToken = async (
    refreshToken: string,
  ): Promise<HasuraToken> => {
    try {
      const accessToken = await fetchAuth<HasuraToken>(`/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!accessToken) {
        throw new Error('Could not consume refresh token');
      }

      return storeNewToken(accessToken);
    } catch (e) {
      logoutUser();
      redirectToLogin();
      throw e;
    }
  };

  const verifyAccessToken = async (accessToken: string): Promise<void> => {
    try {
      await fetchAuth<HasuraToken>(`/token/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
      });
    } catch (e) {
      const backendFailure = e as BackendFailureException;
      if ([401, 400].includes(backendFailure.statusCode)) {
        logoutUser();
        redirectToLogin();

        return;
      }

      throw e;
    }
  };

  const extractTokenInfo = () => {
    const accessToken = hasuraToken?.accessToken;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!accessToken) return {};
    const tokenContent =
      decodeJWT<HasuraAuthJwtType>(accessToken)['https://hasura.io/jwt/claims'];

    return {
      sellerName: tokenContent['x-hasura-sellerName'],
      id: tokenContent['x-hasura-user-id'],
    };
  };

  return {
    extractTokenInfo,
    storeNewToken,
    consumeRefreshToken,
    getUpToDateHasuraToken,
    verifyAccessToken,
    user: hasuraToken ? hasuraToken.user : null,
  };
};
