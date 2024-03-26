import {
  FetchConversationProductDetailsQuery,
  FetchConversationUserDetailsQuery,
  HandDeliveryOrderLineFragmentFragment,
  SubscribeToOpenedPriceOfferSubscription,
} from '@/__generated/graphql';
import { SUBSCRIBE_TO_OPENED_PRICE_OFFERS } from '@/clients/price-offer';
import { HASURA_ROLES } from '@/config';
import useUser from '@/hooks/state/useUser';
import { useHasura } from '@/hooks/useHasura';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import {
  ConversationType,
  NegociationAgreementType,
  PriceOffer,
} from '@/types';
import { gql, useSubscription } from '@apollo/client';
import first from 'lodash/first';
import { useEffect } from 'react';
import ChatPanel, { AssociatedOrderLine, AssociatedProductDetails } from '.';

const ORDER_LINE_FRAGMENT = gql`
  fragment HandDeliveryOrderLineFragment on OrderLines {
    order {
      shopifyId
    }
    shippingSolution
    productVariant {
      product {
        shopifyId
      }
    }
  }
`;

const FETCH_CONVERSATION_USER_DETAILS = gql`
  ${ORDER_LINE_FRAGMENT}

  query fetchConversationUserDetails($userShopifyId: bigint) {
    Customer(where: { shopifyId: { _eq: $userShopifyId } }) {
      purchasedOrders {
        orderLines {
          ...HandDeliveryOrderLineFragment
        }
      }
      vendorSoldOrderLines {
        ...HandDeliveryOrderLineFragment
      }
      onlineProducts {
        shopifyId
      }
    }
  }
`;

const FETCH_CONVERSATION_PRODUCT_DETAILS = gql`
  query fetchConversationProductDetails($productShopifyId: bigint) {
    Product(where: { shopifyId: { _eq: $productShopifyId } }) {
      id
      handle
      variants {
        storeExposedVariant {
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
  currentProductId: string,
): HandDeliveryOrderLineFragmentFragment | null =>
  orderLines.find(
    (orderLine) =>
      orderLine.productVariant?.product.shopifyId === currentProductId,
  ) ?? null;

const extractAssociatedOrderLine = (
  response: FetchConversationUserDetailsQuery,
  currentProductId: string,
): AssociatedOrderLine | null => {
  const customer = first(response?.Customer);

  const rawAssociatedOrderLine =
    findAssociatedOrderLine(
      customer?.purchasedOrders.flatMap((order) => order.orderLines) ?? [],
      currentProductId,
    ) ??
    findAssociatedOrderLine(
      customer?.vendorSoldOrderLines ?? [],
      currentProductId,
    );

  if (!rawAssociatedOrderLine) return null;

  return {
    orderShopifyId: rawAssociatedOrderLine.order.shopifyId,
    productShopifyId:
      rawAssociatedOrderLine.productVariant?.product.shopifyId ?? '',
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
  const price = first(first(response.Product)?.variants)?.storeExposedVariant
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
    id: product.id,
    vendorId: product.vendorId,
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
    async (productShopifyId: string) =>
      fetchProductDetails({ productShopifyId: parseInt(productShopifyId) }),
    [],
  );
  const [userDetailsState, doFetchUser] = useWrappedAsyncFn(
    (userShopifyId: string) =>
      fetchUserDetails({ userShopifyId: parseInt(userShopifyId) }),
    [],
  );

  const { loading: priceOfferLoading, data: priceOfferResult } =
    useSubscription<SubscribeToOpenedPriceOfferSubscription>(
      SUBSCRIBE_TO_OPENED_PRICE_OFFERS,
      {
        variables: {
          productShopifyId: parseInt(conversation.productId),
          buyerShopifyId: parseInt(conversation.customerId),
        },
      },
    );

  useEffect(() => {
    (async () => {
      doFetchProduct(conversation.productId);
    })();
  }, [conversation.productId]);

  useEffect(() => {
    (async () => {
      const userShopifyId = extractTokenInfo().shopifyId;
      if (!userShopifyId) return;
      doFetchUser(userShopifyId);
    })();
  }, []);

  const associatedOrderLine = userDetailsState.value
    ? extractAssociatedOrderLine(userDetailsState.value, conversation.productId)
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
    <ChatPanel
      loading={
        userDetailsState.loading ||
        productDetailsState.loading ||
        priceOfferLoading
      }
      productDetails={productDetails}
      negociationAgreement={negociationAgreement}
      associatedOrderLine={associatedOrderLine}
      productId={conversation.productId}
      conversation={conversation}
      setPanelHeight={setPanelHeight}
      proposedPriceOffer={proposedPriceOffer}
      user={hasuraToken?.user}
    />
  );
};

export default WrappedChatPanel;
