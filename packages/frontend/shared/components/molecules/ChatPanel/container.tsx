import {
  FetchConversationProductDetailsQuery,
  FetchConversationUserDetailsQuery,
  HandDeliveryOrderLineFragmentFragment,
  SubscribeToOpenedPriceOfferSubscription,
} from '@/__generated/graphql';
import { SUBSCRIBE_TO_OPENED_PRICE_OFFERS } from '@/clients/price-offer';
import useUser from '@/hooks/state/useUser';
import { gql_registered_user, useHasura } from '@/hooks/useHasura';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import {
  ConversationType,
  NegociationAgreementType,
  PriceOffer,
} from '@/types';
import { useSubscription } from '@apollo/client';
import first from 'lodash/first';
import { useEffect } from 'react';
import { HASURA_ROLES } from 'shared-types';
import ChatPanel, { AssociatedOrderLine, AssociatedProductDetails } from '.';

const ORDER_LINE_FRAGMENT = gql_registered_user`
  fragment HandDeliveryOrderLineFragment on OrderLines {
    order {
      shopifyId
    }
    shippingSolution
    productVariant {
      product {
        id
      }
    }
  }
`;

const FETCH_CONVERSATION_USER_DETAILS = gql_registered_user`
  ${ORDER_LINE_FRAGMENT}

  query fetchConversationUserDetails($userInternalId: uuid) {
    Customer(where: { authUserId: { _eq: $userInternalId } }) {
      purchasedOrders {
        orderLines {
          ...HandDeliveryOrderLineFragment
        }
      }
      vendorSoldOrderLines {
        ...HandDeliveryOrderLineFragment
      }
      onlineProducts {
        id
      }
    }
  }
`;

const FETCH_CONVERSATION_PRODUCT_DETAILS = gql_registered_user`
  query fetchConversationProductDetails($productInternalId: String) {
    Product(where: { id: { _eq: $productInternalId } }) {
      id
      handle
      variants {
        storeB2CVariant {
          price
        }
      }
      vendorId
      Vendor {
        negociationAgreements {
          maxAmountPercent
          priority
          productType
        }
      }
    }
  }
`;

const findAssociatedOrderLine = (
  orderLines: HandDeliveryOrderLineFragmentFragment[],
  currentProductInternalId: string,
): HandDeliveryOrderLineFragmentFragment | null =>
  orderLines.find(
    (orderLine) =>
      orderLine.productVariant?.product.id === currentProductInternalId,
  ) ?? null;

const extractAssociatedOrderLine = (
  response: FetchConversationUserDetailsQuery,
  currentProductInternalId: string,
): AssociatedOrderLine | null => {
  const customer = first(response?.Customer);

  const rawAssociatedOrderLine =
    findAssociatedOrderLine(
      customer?.purchasedOrders.flatMap((order) => order.orderLines) ?? [],
      currentProductInternalId,
    ) ??
    findAssociatedOrderLine(
      customer?.vendorSoldOrderLines ?? [],
      currentProductInternalId,
    );

  if (!rawAssociatedOrderLine) return null;

  return {
    orderShopifyId: rawAssociatedOrderLine.order.shopifyId,
    shippingSolution: rawAssociatedOrderLine.shippingSolution,
  };
};

const extractNegociationAgreement = (
  response: FetchConversationProductDetailsQuery,
): NegociationAgreementType | null => {
  const rawNegociationAgreement = first(
    first(response.Product)?.Vendor.negociationAgreements,
  );

  if (!rawNegociationAgreement) return null;

  return {
    maxAmountPercent: rawNegociationAgreement.maxAmountPercent,
    productType: rawNegociationAgreement.productType,
  };
};

const extractOriginalPrice = (
  response: FetchConversationProductDetailsQuery,
): number => {
  const price = first(first(response.Product)?.variants)?.storeB2CVariant
    ?.price;

  if (!price) throw new Error('Could not find price on product');

  return price;
};

const extractProductDetails = (
  response: FetchConversationProductDetailsQuery,
): AssociatedProductDetails | null => {
  const product = first(response.Product);
  if (!product) return null;

  return {
    handle: product.handle ?? '',
    originalPrice: extractOriginalPrice(response),
    internalId: product.id,
    vendorInternalId: product.vendorId,
  };
};

const extractPriceOffer = (
  response: SubscribeToOpenedPriceOfferSubscription,
): PriceOffer | null => {
  const rawPriceOffer = first(response.PriceOffer);

  if (!rawPriceOffer) return null;

  return {
    id: rawPriceOffer.id,
    newPrice: rawPriceOffer.newPriceInCents / 100,
    initiatorId: rawPriceOffer.initiatedBy,
    discountCode: rawPriceOffer.discountCode ?? null,
    status: rawPriceOffer.status,
  };
};

type PropsType = {
  conversation: ConversationType;
  setPanelHeight: (height: number) => void;
};

const WrappedChatPanel: React.FC<PropsType> = ({
  conversation,
  setPanelHeight,
}) => {
  const { extractTokenInfo } = useHasuraToken();
  const { hasuraToken } = useUser();

  const fetchUserDetails = useHasura<FetchConversationUserDetailsQuery>(
    FETCH_CONVERSATION_USER_DETAILS,
    HASURA_ROLES.REGISTERED_USER,
  );
  const fetchProductDetails = useHasura<FetchConversationProductDetailsQuery>(
    FETCH_CONVERSATION_PRODUCT_DETAILS,
    HASURA_ROLES.REGISTERED_USER,
  );

  const [productDetailsState, doFetchProduct] = useWrappedAsyncFn(
    async (productInternalId: string) =>
      fetchProductDetails({ productInternalId }),
    [],
  );
  const [userDetailsState, doFetchUser] = useWrappedAsyncFn(
    (userInternalId: string) => fetchUserDetails({ userInternalId }),
    [],
  );

  const { loading: priceOfferLoading, data: priceOfferResult } =
    useSubscription<SubscribeToOpenedPriceOfferSubscription>(
      SUBSCRIBE_TO_OPENED_PRICE_OFFERS,
      {
        variables: {
          productInternalId: conversation.productInternalId,
          buyerInternalId: conversation.customerInternalId,
        },
      },
    );

  useEffect(() => {
    (async () => {
      doFetchProduct(conversation.productInternalId);
    })();
  }, [conversation.productInternalId]);

  useEffect(() => {
    (async () => {
      const userInternalId = extractTokenInfo().id;
      if (!userInternalId) return;
      doFetchUser(userInternalId);
    })();
  }, []);

  const associatedOrderLine = userDetailsState.value
    ? extractAssociatedOrderLine(
        userDetailsState.value,
        conversation.productInternalId,
      )
    : null;

  const productDetails = productDetailsState.value
    ? extractProductDetails(productDetailsState.value)
    : null;

  const negociationAgreement = productDetailsState.value
    ? extractNegociationAgreement(productDetailsState.value)
    : null;

  const proposedPriceOffer = priceOfferResult
    ? extractPriceOffer(priceOfferResult)
    : null;

  return (
    <>
      <ChatPanel
        loading={
          userDetailsState.loading ||
          productDetailsState.loading ||
          priceOfferLoading
        }
        productDetails={productDetails}
        negociationAgreement={negociationAgreement}
        associatedOrderLine={associatedOrderLine}
        conversation={conversation}
        setPanelHeight={setPanelHeight}
        proposedPriceOffer={proposedPriceOffer}
        user={hasuraToken?.user}
      />
    </>
  );
};

export default WrappedChatPanel;
