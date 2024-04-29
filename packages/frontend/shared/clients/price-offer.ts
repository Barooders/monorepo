import { gql_registered_user } from '@/__generated/hasura-role.config';

export const SUBSCRIBE_TO_OPENED_PRICE_OFFERS = gql_registered_user`
  subscription subscribeToOpenedPriceOffer(
    $productInternalId: String
    $buyerInternalId: uuid
  ) {
    PriceOffer(
      where: {
        _and: {
          product: { id: { _eq: $productInternalId } }
          buyer: { authUserId: { _eq: $buyerInternalId } }
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
      product {
        shopifyId
      }
    }
  }
`;
