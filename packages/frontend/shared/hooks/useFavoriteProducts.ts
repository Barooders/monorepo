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
        shopifyId
      }
    }
  }
`;

const ADD_FAVORITE_PRODUCT = /* GraphQL */ /* typed_for_registered_user */ `
  mutation addFavoriteProduct($customerId: uuid!, $productShopifyId: bigint) {
    insert_FavoriteProducts_one(
      object: { customerId: $customerId, productId: $productShopifyId }
    ) {
      id
    }
  }
`;

const REMOVE_FAVORITE_PRODUCT = /* GraphQL */ /* typed_for_registered_user */ `
  mutation removeFavoriteProducts(
    $customerId: uuid!
    $productShopifyId: bigint
  ) {
    delete_FavoriteProducts(
      where: {
        _and: {
          customerId: { _eq: $customerId }
          productId: { _eq: $productShopifyId }
        }
      }
    ) {
      affected_rows
    }
  }
`;

const useFavoriteProducts = () => {
  const { needsLogin, isLoggedIn } = useIsLoggedIn();
  const fetchFavoriteProducts = useHasura(graphql(FETCH_FAVORITE_PRODUCT));
  const addFavoriteProduct = useHasura(graphql(ADD_FAVORITE_PRODUCT));
  const removeFavoriteProduct = useHasura(graphql(REMOVE_FAVORITE_PRODUCT));
  const { extractTokenInfo } = useHasuraToken();
  const {
    setFavoriteProducts,
    addFavoriteProduct: addFavoriteProductState,
    removeFavoriteProduct: removeFavoriteProductState,
  } = useUser();

  return {
    fetchFavoriteProducts: async () => {
      if (!isLoggedIn) return [];

      const { FavoriteProducts } = await fetchFavoriteProducts();

      const favoriteProducts = FavoriteProducts.flatMap(({ product }) =>
        product ? [product] : [],
      );

      setFavoriteProducts(
        favoriteProducts.map(({ shopifyId }) => shopifyId).map(String),
      );

      return favoriteProducts;
    },
    addFavoriteProducts: needsLogin<[string], Promise<void>>(
      async (productShopifyId: string) => {
        try {
          addFavoriteProductState(productShopifyId);
          addFavoriteProduct({
            customerId: extractTokenInfo().id,
            productShopifyId: Number(productShopifyId),
          });
        } catch (e) {
          removeFavoriteProductState(productShopifyId);
          throw e;
        }
      },
    ),
    removeFavoriteProducts: needsLogin<[string], Promise<void>>(
      async (productShopifyId: string) => {
        try {
          removeFavoriteProductState(productShopifyId);
          removeFavoriteProduct({
            customerId: extractTokenInfo().id,
            productShopifyId: Number(productShopifyId),
          });
        } catch (e) {
          addFavoriteProductState(productShopifyId);
          throw e;
        }
      },
    ),
  };
};

export default useFavoriteProducts;
