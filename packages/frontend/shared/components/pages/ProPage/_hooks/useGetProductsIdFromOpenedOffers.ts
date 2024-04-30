import {
  RegisteredUserTypes,
  gql_registered_user,
} from '@/__generated/hasura-role.config';
import { useHasura } from '@/hooks/useHasura';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import useOpenedOffersState from '../_state/useOpenedOffersState';

const FETCH_OPENED_B2B_PRICE_OFFERS = gql_registered_user`
  query fetchOpenedB2BPriceOffers {
    PriceOffer(
      where: {
        _and: {
          salesChannelName: { _eq: "B2B" }
          _or: [
            { status: { _eq: "PROPOSED" } }
            { status: { _eq: "ACCEPTED" } }
          ]
        }
      }
    ) {
      productId
    }
  }
`;

const useGetProductsIdFromOpenedOffers = () => {
  const { openedPriceOfferProductIds, setOpenedPriceOfferProductIds } =
    useOpenedOffersState();

  const fetchOpenedOffers =
    useHasura<RegisteredUserTypes.FetchOpenedB2BPriceOffersQuery>(
      FETCH_OPENED_B2B_PRICE_OFFERS,
      HASURA_ROLES.REGISTERED_USER,
    );

  useEffect(() => {
    (async () => {
      const { PriceOffer } = await fetchOpenedOffers();
      setOpenedPriceOfferProductIds(PriceOffer.map((po) => po.productId));
    })();
  }, []);

  return { openedPriceOfferProductIds };
};

export default useGetProductsIdFromOpenedOffers;
