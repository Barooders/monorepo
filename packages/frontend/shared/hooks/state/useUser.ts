'use client';

import { sendAddToWishlist } from '@/analytics';
import { identify } from '@/analytics/klaviyo';
import { HasuraToken } from '@/types';
import { createPersistedStore } from './createPersistedStore';

interface UserState {
  hasuraToken: HasuraToken | null;
  favoriteProducts: string[];
  setHasuraToken: (value: HasuraToken | null) => void;
  logoutUser: () => void;
  setFavoriteProducts: (value: string[]) => void;
  addFavoriteProduct: (productId: string) => void;
  removeFavoriteProduct: (productId: string) => void;
  validateHasuraToken: (value: HasuraToken | null) => boolean;
}

const useUser = createPersistedStore<UserState>(
  (set, get) => {
    return {
      hasuraToken: null,
      favoriteProducts: [],

      setHasuraToken: (value: HasuraToken | null) => {
        set((state) => ({
          hasuraToken:
            !!value && state.validateHasuraToken(value)
              ? { ...value, creationDate: Date.now() }
              : null,
        }));
        if (value?.user.email) {
          identify(value?.user.email);
        }
      },

      setFavoriteProducts: (productIds: string[]) => {
        set(() => ({
          favoriteProducts: productIds,
        }));
      },

      addFavoriteProduct: (productId: string) => {
        set((state) => ({
          favoriteProducts: state.favoriteProducts.includes(productId)
            ? state.favoriteProducts
            : [...state.favoriteProducts, productId],
        }));
        sendAddToWishlist(productId, get().hasuraToken?.user.id ?? '');
      },

      removeFavoriteProduct: (productId: string) => {
        set((state) => {
          return {
            favoriteProducts: state.favoriteProducts.filter(
              (favoriteProduct) => favoriteProduct !== productId,
            ),
          };
        });
      },

      logoutUser: async () => {
        //identifyToAnalytics();
        set(() => ({
          hasuraToken: null,
          favoriteProducts: [],
        }));
      },

      validateHasuraToken: (hasuraToken) => {
        return (
          !!hasuraToken &&
          !!hasuraToken.accessToken &&
          !!hasuraToken.user &&
          !!hasuraToken.refreshToken
        );
      },
    };
  },
  {
    name: 'userState',
    onRehydrateStorage: () => (state) => {
      if (
        state?.hasuraToken &&
        !state?.validateHasuraToken(state.hasuraToken)
      ) {
        state?.setHasuraToken(null);
      }
      if (!!state?.hasuraToken) {
        const {
          user: { email },
        } = state.hasuraToken;
        identify(email);
      }
    },
  },
);

export default useUser;
