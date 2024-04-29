'use client';

import { FetchSoldOrderLinesQuery } from '@/__generated/graphql';
import Loader from '@/components/atoms/Loader';
import SmallCard from '@/components/atoms/SmallCard';
import VirtualizedTable from '@/components/atoms/VirtualizedTable';
import { gql_me_as_vendor, useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import { mapProductFromGraphQl } from '../../_helpers/map-product';
import { ORDER_STATUS_COLORS } from '../../config';
import { OrderStatus } from '../../types';
import { HASURA_ROLES } from 'shared-types';

const dict = getDictionary('fr');

const getDisplayedStatus = (status: OrderStatus) => {
  return (
    dict.account.orderStatus[status]?.long ??
    dict.account.orderStatus.unknown.long
  );
};

type Order = {
  product: {
    title: string | null;
    tag: string | null;
    description: string;
    imageSrc: string | null;
    link: string;
  };
  price: string;
  orderDate: string;
  orderLink: string;
  orderName: string;
  status: OrderStatus;
};

const FETCH_SOLD_ORDER_LINES = gql_me_as_vendor`
  query fetchSoldOrderLines {
    Customer(limit: 1) {
      vendorSoldOrderLines(
        order_by: { createdAt: desc }
        where: { order: { status: { _neq: "CREATED" } } }
      ) {
        priceInCents
        order {
          id
          status
          name
          createdAt
        }
        brand: productBrand
        productType
        handle: productHandle
        size: productSize
        condition: variantCondition
        gender: productGender
        modelYear: productModelYear
        productImage
      }
    }
  }
`;

const OrdersTables = () => {
  const fetchSoldOrderLines = useHasura<FetchSoldOrderLinesQuery>(
    FETCH_SOLD_ORDER_LINES,
    HASURA_ROLES.ME_AS_VENDOR,
  );

  const [{ loading, error, value }, doFetchOrders] = useWrappedAsyncFn<
    () => Promise<Order[]>
  >(async () => {
    const { Customer } = await fetchSoldOrderLines();
    if (Customer.length === 0) return [];

    const { vendorSoldOrderLines } = Customer[0];
    return vendorSoldOrderLines.reduce(
      (
        acc: Order[],
        { priceInCents, order, productImage, condition, ...restOfProduct },
      ) => {
        if (!order || !restOfProduct.productType) return acc;

        return [
          ...acc,
          {
            product: mapProductFromGraphQl({
              ...restOfProduct,
              product: {
                variants: [
                  {
                    variant: {
                      condition,
                    },
                    b2cVariant: {},
                  },
                ],
              },
              firstImage: productImage,
            }),
            price: priceInCents
              ? `${(Number(priceInCents) / 100).toFixed(2)} €`
              : '',
            orderDate: new Date(order.createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            orderName: order.name ?? '',
            orderLink: `/account/order/${order.id}`,
            status: order.status as OrderStatus,
          },
        ];
      },
      [],
    );
  });

  useEffect(() => {
    doFetchOrders();
  }, []);

  return loading ? (
    <Loader className="m-auto h-8 w-8" />
  ) : error ? (
    <p className="text-red-600">{dict.global.errors.unknownError}</p>
  ) : value ? (
    <VirtualizedTable
      searchPlaceholder={dict.account.tables.searchPlaceholder.order}
      width={1268}
      desktopRowHeight={61}
      mobileRowHeight={252}
      rows={value.map(
        ({ product, price, orderDate, orderName, status, orderLink }) => ({
          label: (
            <SmallCard
              title={product.title}
              tag={product.tag}
              description={product.description}
              imageSrc={product.imageSrc}
              link={orderLink}
            />
          ),
          price,
          orderDate,
          orderName,
          status: (
            <div
              className={`${ORDER_STATUS_COLORS[status]} rounded px-1.5 py-1 font-semibold`}
            >
              {getDisplayedStatus(status)}
            </div>
          ),
        }),
      )}
      columns={{
        desktopColumns: {
          label: {
            width: 400,
            label: dict.account.tables.columns.label,
          },
          price: {
            width: 100,
            label: dict.account.tables.columns.price,
          },
          orderDate: {
            width: 200,
            label: dict.account.tables.columns.orderDate,
          },
          orderName: {
            width: 200,
            label: dict.account.tables.columns.orderName,
          },
          status: {
            width: 367,
            label: dict.account.tables.columns.status,
          },
        },
        highlightedMobileColumns: ['status', 'label'],
      }}
    />
  ) : (
    <></>
  );
};

export default OrdersTables;
