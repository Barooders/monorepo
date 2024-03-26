import { operations } from '@/__generated/rest-schema';
import { sendLogin } from '@/analytics';
import { fetchAuth } from '@/clients/auth';
import { HasuraAuthJwtType, HasuraToken } from '@/types';
import { decodeJWT } from '@/utils/decodeJWT';
import { useRouter } from 'next/navigation';
import useUser from './state/useUser';
import useBackend from './useBackend';
import useFavoriteProducts from './useFavoriteProducts';
import { useHasuraToken } from './useHasuraToken';
import useStorefront, {
  GET_STOREFRONT_TOKEN_FROM_MULTIPASS,
} from './useStorefront';
import { HASURA_ROLES } from 'shared-types';

type LoginResponseType = {
  status: number;
  session: Omit<HasuraToken, 'creationDate'>;
};

export const useAuth = () => {
  const router = useRouter();
  const { logoutUser, hasuraToken } = useUser();
  const { storeNewToken, consumeRefreshToken } = useHasuraToken();
  const { fetchFavoriteProducts } = useFavoriteProducts();
  const { fetchAPI } = useBackend();

  const getShopifyTokenFromMultipass = useStorefront<{
    customerAccessTokenCreateWithMultipass: {
      customerAccessToken: {
        accessToken: string;
      };
    };
  }>(GET_STOREFRONT_TOKEN_FROM_MULTIPASS);

  const finalizeLogin = async (
    redirectUrl = '/account',
    hasuraToken: HasuraToken,
  ): Promise<void> => {
    await fetchFavoriteProducts();
    sendLogin(hasuraToken.user.id);
    if (!hasuraToken)
      throw new Error('Could not redirect to Multipass as token is missing');
    if (!checkProfileCompleteness(hasuraToken?.accessToken)) {
      router.push('/account/register/light');
      return;
    }

    router.push(redirectUrl);
  };

  const checkProfileCompleteness = (accessToken: string): boolean => {
    const tokenContent = decodeJWT<HasuraAuthJwtType>(accessToken);

    return !!tokenContent['https://hasura.io/jwt/claims'][
      'x-hasura-sellerName'
    ];
  };

  const loginWithToken = async (refreshToken: string, redirectUrl?: string) => {
    const hasuraToken = await consumeRefreshToken(refreshToken);
    await finalizeLogin(redirectUrl, hasuraToken);
  };

  const loginWithPassword = async (
    email: string,
    password: string,
    recaptchaChallenge: string,
    redirectUrl?: string,
  ) => {
    const result = await fetchAuth<LoginResponseType>(
      `/signin/email-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          recaptchaChallenge,
        }),
      },
    );

    const hasuraToken = storeNewToken(result.session);
    await finalizeLogin(redirectUrl, hasuraToken);
  };

  const logout = async () => {
    await fetchAuth<void>(`/signout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: hasuraToken?.refreshToken }),
    });
    logoutUser();
    router.push('/');
  };

  const isAdmin = () => {
    return hasuraToken?.user.roles.includes(HASURA_ROLES.ADMIN) || false;
  };

  const isB2BUser = () => {
    return hasuraToken?.user.roles.includes(HASURA_ROLES.B2B_USER) || false;
  };

  const getShopifyToken = async () => {
    const multipassResponse = await fetchAPI<
      operations['ShopifyController_shopifyLogin']['responses']['default']['content']['application/json']
    >('/v1/auth/shopify', { method: 'POST' });

    const response = await getShopifyTokenFromMultipass({
      multipassToken: multipassResponse.multipassToken,
    });

    return response.customerAccessTokenCreateWithMultipass.customerAccessToken
      .accessToken;
  };

  return {
    loginWithPassword,
    loginWithToken,
    logout,
    isAdmin,
    isB2BUser,
    getShopifyToken,
  };
};
