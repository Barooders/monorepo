'use client';
import { graphql } from '@/__generated/gql/registered_user';
import { FetchOrderDataSubscription } from '@/__generated/gql/registered_user/graphql';
import Breadcrumbs from '@/components/atoms/Breadcrumbs';
import Button from '@/components/atoms/Button';
import ContactCard from '@/components/atoms/ContactCard';
import Link from '@/components/atoms/Link';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import PageContainer from '@/components/atoms/PageContainer';
import useBackend from '@/hooks/useBackend';
import useFlag from '@/hooks/useFlag';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { AccountSections, CurrencyCode } from '@/types';
import { getTimeAgoSentence } from '@/utils/date';
import { useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { FaCheck, FaSearch } from 'react-icons/fa';
import CancelOrderForm from './_components/CancelOrderForm';
import ShippingLabelButton from './_components/ShippingLabelButton';
import TrackingURLForm from './_components/TrackingURLForm';
import { ORDER_STATUS_COLORS } from './config';
import { FulfillmentOrderStatus, OrderStatus, ShippingSolution } from './types';

const dict = getDictionary('fr');
const roundedCard = 'mt-4 rounded-lg border border-zinc-200';

type Amount = {
  amountInCents: number;
  currency: CurrencyCode;
};

type PriceLine =
  | 'PRODUCT_PRICE'
  | 'BUYER_SHIPPING'
  | 'BUYER_COMMISSION'
  | 'BUYER_DISCOUNT'
  | 'VENDOR_SHIPPING'
  | 'VENDOR_COMMISSION';

type AccountPageOrder = {
  viewer: 'buyer' | 'vendor';
  contact: {
    name: string | null;
    signedInAtTimestamp: number;
    imageSrc: string | null;
  } | null;
  chatLink: string | null;
  priceDetail: {
    lines: {
      type: PriceLine;
      amount: Amount;
    }[];
    total: Amount;
  };
  orderHistory: {
    status: OrderStatus;
    updatedAt: string | null;
    isCompleted: boolean;
  }[];
};

const getDisplayedStatus = (status: string | null) => {
  if (!status) return dict.account.orderStatus.unknown.long;

  return (
    dict.account.orderStatus[status as OrderStatus].long ??
    dict.account.orderStatus.unknown.long
  );
};

const getContactLabels = (viewer: AccountPageOrder['viewer']) => {
  switch (viewer) {
    case 'buyer':
      return {
        since: dict.account.vendorSince,
        linkLabel: dict.account.order.contactVendor,
      };
    case 'vendor':
      return {
        since: dict.account.buyerSince,
        linkLabel: dict.account.order.contactBuyer,
      };
    default:
      return {
        since: dict.account.signedSince,
        linkLabel: dict.account.order.contact,
      };
  }
};

const FETCH_ORDER_DATA = /* GraphQL */ /* gql_registered_user */ `
  subscription fetchOrderData($orderId: String) {
    Order(where: { id: { _eq: $orderId } }) {
      name
      createdAt
      shippingAddressAddress1
      shippingAddressAddress2
      shippingAddressCity
      shippingAddressCountry
      shippingAddressPhone
      shippingAddressFirstName
      shippingAddressLastName
      shippingAddressZip
      status
      orderLines {
        brand: productBrand
        variantName: name
        productType
        modelYear: productModelYear
        size: productSize
        condition: variantCondition
        handle: productHandle
        productImage
        priceInCents
        shippingSolution
        id
        fulfillmentOrder {
          fulfillments {
            trackingUrl
          }
          status
        }
      }
    }
  }
`;

type PropsType = {
  orderId: string;
};

const mapOrderFromHasura = (data: FetchOrderDataSubscription['Order']) => {
  const order = data[0];

  if (!order.orderLines || order.orderLines.length === 0) {
    throw new Error(`Order lines not found in order: ${order.name}`);
  }

  const orderLine = order.orderLines[0];
  const {
    brand,
    productType,
    variantName,
    size,
    modelYear,
    condition,
    priceInCents,
    handle,
    productImage,
    fulfillmentOrder,
    id,
    shippingSolution,
  } = orderLine;

  return {
    product: {
      brand: brand ? brand.toUpperCase() : '',
      productType: productType ?? '',
      description: [
        ...(size
          ? [`${dict.components.productCard.sizeLabel} ${size.toUpperCase()}`]
          : []),
        modelYear,
        condition
          ? dict.components.productCard.getConditionLabel(condition)
          : undefined,
      ]
        .flatMap((s) => (s ? [s] : []))
        .map((s) => s.trim())
        .join(' · '),
      price: priceInCents ? `${(Number(priceInCents) / 100).toFixed(2)} €` : '',
      link: `/products/${handle}`,
      imageSrc: productImage,
      variantName,
    },
    order: {
      name: order.name,
      status: order.status as OrderStatus,
      statusLabel: getDisplayedStatus(order.status),
      title: brand
        ? `${brand.toUpperCase()}, ${productType?.toLowerCase()}`
        : productType ?? '',
      createdAt: new Date(order.createdAt).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      trackingUrl:
        fulfillmentOrder?.fulfillments.find(
          (fulfillment) => fulfillment.trackingUrl !== '',
        )?.trackingUrl ?? null,
      hasToFillTrackingUrl:
        shippingSolution === ShippingSolution.VENDOR &&
        fulfillmentOrder?.fulfillments.length === 0 &&
        fulfillmentOrder?.status === FulfillmentOrderStatus.OPEN,
      canCancelOrderLine:
        order.status === OrderStatus.LABELED ||
        order.status === OrderStatus.PAID,
      canShowShippingLabelDowloadButton:
        (order.status === OrderStatus.LABELED ||
          order.status === OrderStatus.PAID) &&
        shippingSolution === ShippingSolution.SENDCLOUD,
      firstOrderLineId: id,
      shippingAddress:
        order.shippingAddressAddress1 && order.shippingAddressCity
          ? {
              fullName: [
                order.shippingAddressFirstName,
                order.shippingAddressLastName,
              ]
                .filter(Boolean)
                .join(' '),
              address1: order.shippingAddressAddress1,
              address2: order.shippingAddressAddress2,
              zipAndCity: [order.shippingAddressZip, order.shippingAddressCity]
                .filter(Boolean)
                .join(' '),
              country: order.shippingAddressCountry,
              phoneNumber:
                shippingSolution === ShippingSolution.VENDOR
                  ? order.shippingAddressPhone
                  : null,
            }
          : null,
    },
  };
};

const OrderDetails: React.FC<PropsType> = ({ orderId }) => {
  const showTrackingFeature = useFlag('order-page.tracking-data');

  const {
    loading: hasuraLoading,
    error: hasuraError,
    data: rawHasuraValue,
  } = useSubscription(graphql(FETCH_ORDER_DATA), {
    variables: {
      orderId,
    },
  });
  const { fetchAPI } = useBackend();

  const hasuraValue = rawHasuraValue?.Order
    ? mapOrderFromHasura(rawHasuraValue.Order)
    : null;

  const [
    { loading: backendLoading, error: backendError, value: backendValue },
    fetchOrderComputedData,
  ] = useWrappedAsyncFn(() =>
    fetchAPI<AccountPageOrder>(`/v1/orders/${orderId}`),
  );

  useEffect(() => {
    fetchOrderComputedData();
  }, []);

  if (hasuraError || backendError) {
    throw new Error(`Order not found with id ${orderId}`);
  }

  return (
    <PageContainer>
      {hasuraLoading || backendLoading ? (
        <Loader className="m-auto h-8 w-8" />
      ) : hasuraValue && backendValue ? (
        <div className="mb-24 grid grid-cols-12 gap-6">
          <div className="col-start-1 col-end-13 lg:col-end-10">
            <Breadcrumbs
              className="mb-5"
              elements={[
                backendValue.viewer === 'buyer'
                  ? {
                      link: '/account/purchases',
                      title:
                        dict.account.sections[AccountSections.PURCHASES].label,
                    }
                  : {
                      link: '/account/catalog?tab=orders',
                      title:
                        dict.account.sections[AccountSections.ORDERS].label,
                    },
                { title: hasuraValue.product.productType ?? '' },
              ]}
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex-grow">
                <p
                  className={`${
                    ORDER_STATUS_COLORS[hasuraValue.order.status]
                  } w-fit rounded px-1.5 py-1 text-sm font-semibold`}
                >
                  {hasuraValue.order.statusLabel}
                </p>
                <h1 className="my-3 text-3xl font-semibold">
                  {hasuraValue.order.title}
                </h1>
                <p className="mb-2 text-sm text-gray-400">
                  {hasuraValue.product.variantName}
                </p>
                <p className="flex flex-col text-gray-600 lg:flex-row">
                  <span>
                    {dict.account.order.orderedOn} {hasuraValue.order.createdAt}
                  </span>
                  <span className="ml-0 mt-2 lg:ml-4 lg:mt-0">
                    {dict.account.order.orderNumber}: {hasuraValue.order.name}
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {backendValue.viewer === 'vendor' &&
                  hasuraValue.order.canShowShippingLabelDowloadButton && (
                    <ShippingLabelButton
                      orderId={orderId}
                      orderName={hasuraValue.order.name}
                    />
                  )}
                {backendValue.viewer === 'vendor' &&
                  hasuraValue.order.canCancelOrderLine && (
                    <Modal
                      ButtonComponent={({ openModal }) => (
                        <Button
                          intent="tertiary"
                          className="h-fit"
                          onClick={openModal}
                        >
                          {dict.account.order.cancel.button}
                        </Button>
                      )}
                      ContentComponent={({ closeModal }) => (
                        <CancelOrderForm
                          closeModal={closeModal}
                          orderLineId={hasuraValue.order.firstOrderLineId}
                        />
                      )}
                    />
                  )}
              </div>
            </div>
            {backendValue.viewer === 'vendor' &&
              hasuraValue.order.hasToFillTrackingUrl && (
                <TrackingURLForm
                  orderLineId={hasuraValue.order.firstOrderLineId}
                />
              )}
            <div
              className={`${roundedCard} flex flex-col overflow-hidden lg:flex-row`}
            >
              <img
                src={
                  hasuraValue.product.imageSrc ??
                  'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/incognito.png?width=180&height=125'
                }
                alt={hasuraValue.order.title}
                className="h-[220px] w-full object-cover lg:h-[125px] lg:w-[180px]"
              />
              <div className="flex w-full flex-col p-4 lg:flex-row lg:items-center lg:p-0">
                <div className="ml-0 flex-1 grow lg:ml-4">
                  <p className="flex text-gray-800">
                    <span className="text-xl font-semibold uppercase">
                      {hasuraValue.product.brand}
                    </span>
                    <span className="ml-3 flex items-center rounded-md bg-gray-100 p-1 text-xs">
                      {hasuraValue.product.productType}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-600 lg:mt-2">
                    {hasuraValue.product.description}
                  </p>
                  <p className="text-sm text-gray-800">
                    {hasuraValue.product.price}
                  </p>
                </div>
                <Link
                  href={hasuraValue.product.link}
                  className="mt-3 w-fit rounded-lg bg-gray-100 px-3 py-2.5 text-center font-semibold uppercase lg:mx-4 lg:mt-0"
                >
                  {dict.account.seeProduct}
                </Link>
              </div>
            </div>
            <div className={`${roundedCard} p-4`}>
              <p className="mb-5 text-xl font-semibold">
                {dict.account.order.orderHistory}
              </p>
              <ol className="relative mx-4">
                {backendValue.orderHistory.map((historyItem, index) => {
                  const isNextStepCompleted =
                    backendValue.orderHistory[index + 1]?.isCompleted ?? false;
                  const isLastStep =
                    index === backendValue.orderHistory.length - 1;
                  return (
                    <li
                      key={historyItem.status}
                      className={`${
                        isNextStepCompleted
                          ? 'border-l-2 border-gray-600'
                          : isLastStep
                            ? ''
                            : 'border-l-2 border-gray-200'
                      } pb-10 pl-8`}
                    >
                      {historyItem.isCompleted ? (
                        <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-white ring-4 ring-white">
                          <FaCheck size={12} />
                        </span>
                      ) : (
                        <span className="absolute -left-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 ring-4 ring-white">
                          <FaSearch size={12} />
                        </span>
                      )}

                      {historyItem.updatedAt ? (
                        <>
                          <h3 className="font-medium leading-tight text-gray-800">
                            {dict.account.orderStatus[historyItem.status].since}{' '}
                            {new Date(historyItem.updatedAt).toLocaleDateString(
                              'fr-FR',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              },
                            )}
                            {showTrackingFeature &&
                              historyItem.status === OrderStatus.SHIPPED &&
                              hasuraValue.order.trackingUrl && (
                                <Link
                                  href={hasuraValue.order.trackingUrl}
                                  className="ml-2 underline"
                                >
                                  {dict.account.order.shipping.trackingUrl}
                                </Link>
                              )}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {getTimeAgoSentence(historyItem.updatedAt)}
                          </p>
                        </>
                      ) : (
                        <h3 className="font-medium leading-tight text-gray-800">
                          {dict.account.orderStatus[historyItem.status].short}
                        </h3>
                      )}
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
          <div className="col-start-1 col-end-13 lg:col-start-10">
            {backendValue.contact && (
              <ContactCard
                title={backendValue.contact.name ?? ''}
                subtitle={`${
                  getContactLabels(backendValue.viewer).since
                } ${new Date(
                  backendValue.contact.signedInAtTimestamp,
                ).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                })}`}
                imageSrc={
                  backendValue.contact.imageSrc ??
                  'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/incognito.png?width=60&height=60'
                }
              >
                {backendValue.chatLink && (
                  <Link
                    href={backendValue.chatLink}
                    className="mt-2 w-full rounded-lg bg-gray-100 px-3 py-2.5 text-center font-semibold uppercase sm:mt-6"
                  >
                    {getContactLabels(backendValue.viewer).linkLabel}
                  </Link>
                )}
              </ContactCard>
            )}

            {hasuraValue.order.shippingAddress && (
              <div className={`${roundedCard} p-4`}>
                <p className="mb-5 text-xl font-semibold">
                  {dict.account.shippingAddress}
                </p>
                <p>{hasuraValue.order.shippingAddress.fullName}</p>
                {hasuraValue.order.shippingAddress.phoneNumber && (
                  <p>{hasuraValue.order.shippingAddress.phoneNumber}</p>
                )}
                <p>{hasuraValue.order.shippingAddress.address1}</p>
                {hasuraValue.order.shippingAddress.address2 && (
                  <p>{hasuraValue.order.shippingAddress.address2}</p>
                )}
                <p>{hasuraValue.order.shippingAddress.zipAndCity}</p>
                {hasuraValue.order.shippingAddress.country && (
                  <p>{hasuraValue.order.shippingAddress.country}</p>
                )}
              </div>
            )}
            <div className={`${roundedCard} p-4`}>
              <p className="mb-5 text-xl font-semibold">
                {dict.account.order.price}
              </p>
              {backendValue.priceDetail.lines.map((line) => (
                <div
                  key={line.type}
                  className="flex flex-row justify-between"
                >
                  <p>{dict.account.order.priceDetail[line.type] ?? ''}</p>
                  <p>{(line.amount.amountInCents / 100).toFixed(2)} €</p>
                </div>
              ))}
              <div className="my-5 border border-zinc-200"></div>
              <div className="flex flex-row justify-between font-semibold">
                <p>{dict.account.order.totalPrice}</p>
                <p>
                  {(backendValue.priceDetail.total.amountInCents / 100).toFixed(
                    2,
                  )}{' '}
                  €
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </PageContainer>
  );
};

export default OrderDetails;
