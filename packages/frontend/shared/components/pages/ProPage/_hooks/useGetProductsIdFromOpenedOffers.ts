import { graphql } from '@/__generated/gql/registered_user';
import { useHasura } from '@/hooks/useHasura';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import useOpenedOffersState from '../_state/useOpenedOffersState';

const FETCH_OPENED_B2B_PRICE_OFFERS = /* GraphQL */ /* typed_for_registered_user */ `
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

  const fetchOpenedOffers = useHasura(
    graphql(FETCH_OPENED_B2B_PRICE_OFFERS),
    HASURA_ROLES.REGISTERED_USER,
  );

  useEffect(() => {
    (async () => {
      const { PriceOffer } = await fetchOpenedOffers();
      setOpenedPriceOfferProductIds(PriceOffer.map((po) => po.productId));
    })();
  }, [fetchOpenedOffers, setOpenedPriceOfferProductIds]);

  return { openedPriceOfferProductIds };
};

export default useGetProductsIdFromOpenedOffers;
