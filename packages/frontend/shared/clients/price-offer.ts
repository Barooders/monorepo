import { gql } from '@apollo/client';

export const SUBSCRIBE_TO_OPENED_PRICE_OFFERS = gql`
  subscription subscribeToOpenedPriceOffer(
    $productShopifyId: bigint
    $buyerShopifyId: bigint
  ) {
    PriceOffer(
      where: {
        _and: {
          product: { shopifyId: { _eq: $productShopifyId } }
          buyer: { shopifyId: { _eq: $buyerShopifyId } }
          _or: [
            { status: { _eq: "PROPOSED" } }
            { status: { _eq: "ACCEPTED" } }
          ]
        }
      }
    ) {
      newPriceInCents
      id
      initiatedBy
      status
      discountCode
    }
  }
`;
