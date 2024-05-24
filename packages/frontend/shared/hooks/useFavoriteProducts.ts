import { graphql } from '@/__generated/gql/registered_user';
import useUser from './state/useUser';
import { useHasura } from './useHasura';
import { useHasuraToken } from './useHasuraToken';
import useIsLoggedIn from './useIsLoggedIn';

const FETCH_FAVORITE_PRODUCT = /* GraphQL */ /* typed_for_registered_user */ `
  query fetchFavoriteProducts {
    FavoriteProducts {
      product {
        id
      }
    }
  }
`;

const ADD_FAVORITE_PRODUCT = /* GraphQL */ /* typed_for_registered_user */ `
  mutation addFavoriteProduct($customerId: uuid!, $internalProductId: String!) {
    insert_FavoriteProducts_one(
      object: { customerId: $customerId, internalProductId: $internalProductId }
    ) {
      id
    }
  }
`;

const REMOVE_FAVORITE_PRODUCT = /* GraphQL */ /* typed_for_registered_user */ `
  mutation removeFavoriteProducts(
    $customerId: uuid!
    $internalProductId: String!
  ) {
    delete_FavoriteProducts(
      where: {
        _and: {
          customerId: { _eq: $customerId }
          internalProductId: { _eq: $internalProductId }
        }
      }
    ) {
      affected_rows
    }
  }
`;

const hasShopifyFavoriteProducts = (favoriteProducts: string[]) =>
  favoriteProducts.some((id) => !id.includes('-'));

const useFavoriteProducts = () => {
  const { needsLogin, isLoggedIn } = useIsLoggedIn();
  const fetchFavoriteProducts = useHasura(graphql(FETCH_FAVORITE_PRODUCT));
  const addFavoriteProduct = useHasura(graphql(ADD_FAVORITE_PRODUCT));
  const removeFavoriteProduct = useHasura(graphql(REMOVE_FAVORITE_PRODUCT));
  const { extractTokenInfo } = useHasuraToken();
  const {
    favoriteProducts: storedFavoriteProducts,
    setFavoriteProducts,
    addFavoriteProduct: addFavoriteProductState,
    removeFavoriteProduct: removeFavoriteProductState,
  } = useUser();

  const fetchAndStoreFavoriteProducts = async () => {
    if (!isLoggedIn) return [];

    const { FavoriteProducts } = await fetchFavoriteProducts();

    const favoriteProducts = FavoriteProducts.flatMap(({ product }) =>
      product ? [product] : [],
    );

    setFavoriteProducts(favoriteProducts.map(({ id }) => id).map(String));

    return favoriteProducts;
  };

  return {
    fetchFavoriteProducts: fetchAndStoreFavoriteProducts,
    addFavoriteProducts: needsLogin<[string], Promise<void>>(
      async (internalProductId: string) => {
        if (hasShopifyFavoriteProducts(storedFavoriteProducts)) {
          await fetchAndStoreFavoriteProducts();
        }

        try {
          addFavoriteProductState(internalProductId);
          addFavoriteProduct({
            customerId: extractTokenInfo().id,
            internalProductId,
          });
        } catch (e) {
          removeFavoriteProductState(internalProductId);
          throw e;
        }
      },
    ),
    removeFavoriteProducts: needsLogin<[string], Promise<void>>(
      async (internalProductId: string) => {
        if (hasShopifyFavoriteProducts(storedFavoriteProducts)) {
          await fetchAndStoreFavoriteProducts();
        }

        try {
          removeFavoriteProductState(internalProductId);
          removeFavoriteProduct({
            customerId: extractTokenInfo().id,
            internalProductId,
          });
        } catch (e) {
          addFavoriteProductState(internalProductId);
          throw e;
        }
      },
    ),
  };
};

export default useFavoriteProducts;
