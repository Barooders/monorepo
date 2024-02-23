'use client';

import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import SmallCard from '@/components/atoms/SmallCard';
import VirtualizedTable from '@/components/atoms/VirtualizedTable';
import { HASURA_ROLES } from '@/config';
import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { FetchPurchasesQuery } from '@/__generated/graphql';
import { gql } from '@apollo/client';
import { useEffect } from 'react';
import { ORDER_STATUS_COLORS } from './config';
import { OrderStatus } from './types';
import { mapProductFromGraphQl } from './_helpers/map-product';

const dict = getDictionary('fr');

const getDisplayedStatus = (status: OrderStatus) => {
  return (
    dict.account.orderStatus[status]?.long ??
    dict.account.orderStatus.unknown.long
  );
};

type Purchase = {
  product: {
    title: string | null;
    tag: string | null;
    description: string;
    imageSrc: string | null;
    link: string;
  };
  price: string;
  orderDate: string;
  orderName: string;
  orderLink: string;
  status: OrderStatus;
};

const FETCH_PURCHASES = gql`
  query fetchPurchases {
    Customer(limit: 1) {
      purchasedOrders(order_by: { createdAt: desc }) {
        id
        name
        status
        createdAt
        totalPriceInCents
        orderLines {
          brand: productBrand
          productType
          handle: productHandle
          size: productSize
          condition: variantCondition
          gender: productGender
          modelYear: productModelYear
          name
          productImage
        }
      }
    }
  }
`;

const PurchasesTable = () => {
  const fetchPurchases = useHasura<FetchPurchasesQuery>(
    FETCH_PURCHASES,
    HASURA_ROLES.ME_AS_CUSTOMER,
  );

  const [{ loading, error, value }, doFetchPurchases] = useWrappedAsyncFn<
    () => Promise<Purchase[]>
  >(async () => {
    const { Customer } = await fetchPurchases();
    if (Customer.length === 0) return [];

    const { purchasedOrders } = Customer[0];
    return purchasedOrders.reduce(
      (
        acc: Purchase[],
        { name, orderLines, totalPriceInCents, createdAt, status, id },
      ) => {
        if (!orderLines || orderLines.length === 0) return acc;
        const firstProduct = orderLines[0];
        if (!firstProduct) return acc;

        const { productImage, ...restOfProduct } = firstProduct;
        return [
          ...acc,
          {
            product: mapProductFromGraphQl({
              ...restOfProduct,
              firstImage: productImage,
            }),
            price: totalPriceInCents
              ? `${(Number(totalPriceInCents) / 100).toFixed(2)} €`
              : '',
            orderDate: new Date(createdAt).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
            orderName: name ?? '',
            orderLink: `/account/order/${id}`,
            status: status as OrderStatus,
          },
        ];
      },
      [],
    );
  });

  useEffect(() => {
    doFetchPurchases();
  }, []);

  return (
    <PageContainer>
      <div className="mb-24">
        <h1 className="mb-3 text-3xl">{dict.purchases.title}</h1>
        {loading ? (
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
              ({
                status,
                price,
                orderDate,
                orderName,
                product,
                orderLink,
              }) => ({
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
        )}
      </div>
    </PageContainer>
  );
};

export default PurchasesTable;
