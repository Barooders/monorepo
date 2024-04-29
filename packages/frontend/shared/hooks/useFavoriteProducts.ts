import {
  RegisteredUserTypes,
  gql_registered_user,
} from '@/__generated/hasura-role.config';
import useUser from './state/useUser';
import { useHasura } from './useHasura';
import { useHasuraToken } from './useHasuraToken';
import useIsLoggedIn from './useIsLoggedIn';

const FETCH_FAVORITE_PRODUCT = gql_registered_user`
  query fetchFavoriteProducts {
    FavoriteProducts {
      productId
    }
  }
`;

const ADD_FAVORITE_PRODUCT = gql_registered_user`
  mutation addFavoriteProduct($customerId: uuid!, $productId: bigint) {
    insert_FavoriteProducts_one(
      object: { customerId: $customerId, productId: $productId }
    ) {
      id
    }
  }
`;

const REMOVE_FAVORITE_PRODUCT = gql_registered_user`
  mutation removeFavoriteProducts($customerId: uuid!, $productId: bigint) {
    delete_FavoriteProducts(
      where: {
        _and: {
          customerId: { _eq: $customerId }
          productId: { _eq: $productId }
        }
      }
    ) {
      affected_rows
    }
  }
`;

const useFavoriteProducts = () => {
  const { needsLogin, isLoggedIn } = useIsLoggedIn();
  const fetchFavoriteProducts =
    useHasura<RegisteredUserTypes.FetchFavoriteProductsQuery>(
      FETCH_FAVORITE_PRODUCT,
    );
  const addFavoriteProduct =
    useHasura<RegisteredUserTypes.AddFavoriteProductMutation>(
      ADD_FAVORITE_PRODUCT,
    );
  const removeFavoriteProduct =
    useHasura<RegisteredUserTypes.RemoveFavoriteProductsMutation>(
      REMOVE_FAVORITE_PRODUCT,
    );
  const { extractTokenInfo } = useHasuraToken();
  const {
    setFavoriteProducts,
    addFavoriteProduct: addFavoriteProductState,
    removeFavoriteProduct: removeFavoriteProductState,
  } = useUser();

  return {
    fetchFavoriteProducts: async () => {
      if (!isLoggedIn) return [];

      const result = await fetchFavoriteProducts();
      const favoriteProductIds = result.FavoriteProducts.map(
        (favoriteProduct) => String(favoriteProduct.productId),
      );
      setFavoriteProducts(favoriteProductIds);

      return favoriteProductIds;
    },
    addFavoriteProducts: needsLogin<[string], Promise<void>>(
      async (productId: string) => {
        try {
          addFavoriteProductState(productId);
          addFavoriteProduct({
            customerId: extractTokenInfo().id,
            productId: Number(productId),
          });
        } catch (e) {
          removeFavoriteProductState(productId);
          throw e;
        }
      },
    ),
    removeFavoriteProducts: needsLogin<[string], Promise<void>>(
      async (productId: string) => {
        try {
          removeFavoriteProductState(productId);
          removeFavoriteProduct({
            customerId: extractTokenInfo().id,
            productId: Number(productId),
          });
        } catch (e) {
          addFavoriteProductState(productId);
          throw e;
        }
      },
    ),
  };
};

export default useFavoriteProducts;
